interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-5xl font-semibold tracking-tight text-zinc-100">
        {title}
      </h1>

      <p className="max-w-2xl text-zinc-400">
        {description}
      </p>
    </div>
  );
}