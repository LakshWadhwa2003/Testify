import React from 'react';
import { TestReportView } from './TestReportView';

/**
 * @deprecated The end report is now rendered on a dedicated separate page instead of a pop-up modal.
 * Use TestReportView directly for page navigation.
 */
interface TestResultModalProps {
  submissionId: string;
  onClose: () => void;
  onRetake?: () => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  submissionId,
  onClose,
  onRetake,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <TestReportView
        submissionId={submissionId}
        onBack={onClose}
        onRetake={onRetake ? () => onRetake() : undefined}
      />
    </div>
  );
};
