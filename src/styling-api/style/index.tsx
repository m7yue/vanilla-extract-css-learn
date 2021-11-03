import React from "react";
import { className, parentClass } from "./index.css";

const Style = () => (
	<>
		<div className={parentClass}>
			<div className={className}>
				Style1
			</div>
			<div className={className}>
				Style2
			</div>
			<div className={className}>
				Style3
			</div>
			<div className={className}>
				<span>span</span>
				Style4
			</div>
		</div>
	</>
)

export default Style