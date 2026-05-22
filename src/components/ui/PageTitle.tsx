interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1e2f] hidden lg:block">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1 hidden lg:block">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
