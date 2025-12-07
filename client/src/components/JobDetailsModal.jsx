import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <Dialog open={!!job} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl p-6 shadow-lg w-[400px]">
        <DialogTitle className="text-xl font-semibold mb-4">
          {job.positionTitle}
        </DialogTitle>
        <p><b>Company:</b> {job.companyName}</p>
        <p><b>Status:</b> {job.status}</p>
        <p><b>Date:</b> {job.dateApplied}</p>
        <p className="mt-4"><b>Description:</b><br />{job.description}</p>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
