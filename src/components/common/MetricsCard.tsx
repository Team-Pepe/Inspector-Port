interface MetricsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
}

export default function MetricsCard(props: MetricsCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-tertiary';
      case 'negative':
        return 'text-error';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div class="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-1 hover:bg-surface-container-high transition-colors duration-200">
      <span class="text-[10px] text-secondary font-bold uppercase tracking-widest">{props.title}</span>
      <div class="flex items-end gap-2 mt-1">
        <span class="text-2xl font-black text-on-background">{props.value}</span>
        {props.change && (
          <span class={`text-[10px] mb-1 flex items-center gap-0.5 ${getChangeColor(props.change.type)}`}>
            <span class="material-symbols-outlined" style="font-size: 14px">
              {props.change.type === 'positive' ? 'arrow_upward' : props.change.type === 'negative' ? 'arrow_downward' : 'remove'}
            </span>
            <span>{props.change.value}</span>
          </span>
        )}
      </div>
    </div>
  );
}