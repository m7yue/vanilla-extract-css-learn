import React, { FC } from "react";
import { variant } from "./index.css";

console.log(variant)

interface IProps {
	variant: 'primary' | 'secondary'
}

const StyleVariants: FC<IProps> = (props) => (
	<div className={variant[props.variant]}>
		StyleVariants
	</div>
)

export default StyleVariants