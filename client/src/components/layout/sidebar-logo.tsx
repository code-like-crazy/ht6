const SidebarLogo = () => {
  return (
    <div className="border-sidebar-border/50 flex h-20 items-center justify-center border-b">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border">
          <span className="text-primary font-serif text-lg font-bold">H</span>
        </div>
        <h1 className="text-sidebar-foreground font-serif text-xl font-semibold">
          HT6
        </h1>
      </div>
    </div>
  );
};

export default SidebarLogo;
