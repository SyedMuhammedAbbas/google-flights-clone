import React from "react";
import { IconType } from "react-icons";
import { IconContext, IconBaseProps } from "react-icons";

interface IconProps extends Omit<IconBaseProps, "children"> {
  icon: IconType;
}

export const Icon = ({
  icon: IconComponent,
  ...props
}: IconProps): JSX.Element => {
  return (
    <IconContext.Provider value={{}}>
      {React.createElement(
        IconComponent as React.ComponentType<IconBaseProps>,
        props
      )}
    </IconContext.Provider>
  );
};
