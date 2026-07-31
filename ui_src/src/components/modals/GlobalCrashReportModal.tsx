import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { useCrashModalStore } from '../../store/crash-modal-store';
import { Button } from '../ui/buttons/Button';
import { Icon } from '@iconify/react';
import { toast } from 'react-hot-toast';
import { getProfile } from '../../services/profile-service';
import { uploadLogToMclogs } from '../../services/log-service';
import { writeText, listen } from '../../services/bridge-service';
import { checkCrashLog, fetchCrashReport, getProcessLogCursor } from '../../services/process-service';
import type { CrashlogDto } from '../../types/processState';
import { openExternalUrl } from '../../services/native-service';
import { useGlobalModal } from '../../hooks/useGlobalModal';
import { CrashAnalysisModal } from './CrashAnalysisModal';
import { logError } from '../../utils/logging-utils';
import type { EventPayload } from '../../types/events';
import { EventType } from '../../types/events';
import type { CrashAnalysisResult } from '../../types/processState';

export function GlobalCrashReportModal() {
  const { t } = useTranslation();
  const { isCrashModalOpen, crashData, closeCrashModal } = useCrashModalStore();
  const { showModal, hideModal } = useGlobalModal();
  const [profileName, setProfileName] = useState<string>('');
  const [mclogsUrl, setMclogsUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [displayedCrashReportContent, setDisplayedCrashReportContent] = useState<string | undefined>(undefined);
  const [hasFetchedCrashReport, setHasFetchedCrashReport] = useState(false);

  useEffect(() => {
    if (crashData?.profile_id) {
      setProfileName(crashData.process_metadata?.profile_name || crashData.profile_id);
      getProfile(crashData.profile_id).then(details => details?.name && setProfileName(details.name)).catch(() => {});
      setMclogsUrl(null);
      setIsProcessing(false);
      setDisplayedCrashReportContent(crashData.crash_report_content);
      setHasFetchedCrashReport(false);
    }
  }, [crashData]);

  useEffect(() => {
    let unlistenFn: (() => void) | undefined;
    if (isCrashModalOpen && crashData?.process_id && !hasFetchedCrashReport) {
      setHasFetchedCrashReport(true);
      listen<EventPayload>(EventType.CrashReportContentAvailable, (event) => {
        if (event.payload.target_id === crashData.process_id) {
          setDisplayedCrashReportContent(event.payload.message);
        }
      }).then(u => unlistenFn = u);
    }
    return () => unlistenFn?.();
  }, [isCrashModalOpen, crashData, hasFetchedCrashReport]);

  if (!isCrashModalOpen || !crashData) return null;

  const handlePrimaryAction = async () => {
    setIsProcessing(true);
    try {
      const logContent = crashData.process_metadata?.log_session_id
        ? (await getProcessLogCursor(crashData.process_metadata.log_session_id, 0)).output
        : "";
      const url = await uploadLogToMclogs(`--- CRASH ---\n${displayedCrashReportContent || ""}\n\n--- LOG ---\n${logContent}`);
      setMclogsUrl(url);
      const result = await checkCrashLog({ mcLogsUrl: url, metadata: crashData.process_metadata! } as any) as any;
      closeCrashModal();
      showModal('crash-analysis', <CrashAnalysisModal result={result} profileId={crashData.profile_id} onClose={() => hideModal('crash-analysis')} />);
    } catch (e) {
      logError(`Crash action failed: ${e}`);
      toast.error(t('crash_modal.toast.unexpected_error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal title={t('crash_modal.title')} onClose={closeCrashModal} width="lg" footer={
      <div className="flex gap-3 w-full">
        <Button onClick={handlePrimaryAction} variant="secondary" disabled={isProcessing}>{t('crash_modal.button.analyze')}</Button>
        <Button onClick={() => openExternalUrl('https://discord.norisk.gg')} variant="default">{t('crash_modal.button.contact_support')}</Button>
      </div>
    }>
      <div className="p-6 text-center text-white">
        {isProcessing ? <p>{statusText || t('common.loading')}</p> : <p>{t('crash_modal.description')}</p>}
        <p className="mt-4 text-2xl text-red-400">exit code: {crashData.exit_code ?? 'N/A'}</p>
      </div>
    </Modal>
  );
}
