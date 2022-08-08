import { Component } from "solid-js";

export interface SolidBottomsheetProps {
  title: string;
}

export const SolidBottomsheet: Component<SolidBottomsheetProps> = (props) => (
  <p class="greeting">Hello, {props.title}!</p>
);
