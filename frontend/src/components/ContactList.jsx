const ContactList = () => {
  return (
    <>
      <div className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`avatar `}>
            <div className="size-12 rounded-full">
              <img src={"/avatar.png"} />
            </div>
          </div>
          <h4 className="text-slate-200 font-medium">jon</h4>
        </div>
      </div>
    </>
  );
};

export default ContactList;
