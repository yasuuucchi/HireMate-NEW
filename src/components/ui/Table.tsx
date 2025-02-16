import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={twMerge('relative w-full overflow-auto rounded-lg border border-gray-200 shadow-sm', className)}>
      <table className="w-full caption-bottom text-sm divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={twMerge('bg-primary text-white', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={twMerge('[&_tr:last-child]:border-0', className)}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={twMerge(
      'border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
      className
    )}>
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th className={twMerge(
      'h-12 px-4 text-left align-middle font-medium text-inherit',
      className
    )}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={twMerge(
      'p-4 align-middle text-gray-700',
      className
    )}>
      {children}
    </td>
  );
}
