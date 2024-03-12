export type Tab = { name: string; children: React.ReactNode };

const Tabs = ({ tabs }: { tabs: Tab[] }) => {
  const initialTab = tabs[0];
  return (
    <div className="border-2 border-hot p-2">
      {tabs.map((tab) => (
        <button key={tab.name} className="p-2">
          {tab.name}
        </button>
      ))}
      <div>{initialTab?.children}</div>
    </div>
  );
};

export default Tabs;
