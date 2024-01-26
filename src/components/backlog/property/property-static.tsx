import React from 'react'
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '~/components/ui/input';
import { EntityFieldConfig } from '~/entities/entityTypes';
import { cn } from '~/lib/utils';
import type { NewTask, Task } from '~/server/db/schema';

type Props = {
    form: UseFormReturn<NewTask>;
    property: keyof NewTask;
    config: EntityFieldConfig;
}

const PropertyStatic = ({form, property, config}: Props) => {
  return (
    <>
    <p
    className={cn(
      "px-4 flex-grow-0 w-min whitespace-nowrap",
      {
          "opacity-80": property === "description",
          "font-medium": property === "title",
      },
  )}
    >
            {form.watch(property)}
    </p>
    </>
  )
}

export default PropertyStatic