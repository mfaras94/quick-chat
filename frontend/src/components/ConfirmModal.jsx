function ConfirmModal({
  modalRef,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClassName = "btn btn-error text-white",
  onConfirm,
  isLoading = false,
  loadingText = "Processing...",
}) {
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box bg-zinc-900 border border-zinc-700">
        <h3 className="font-bold text-lg text-zinc-100">{title}</h3>
        <p className="py-3 text-zinc-300">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost text-zinc-300">{cancelText}</button>
          </form>
          <button onClick={onConfirm} className={confirmClassName} disabled={isLoading}>
            {isLoading ? loadingText : confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ConfirmModal;
