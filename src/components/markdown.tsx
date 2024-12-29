import Link from "next/link";
import ReactMarkdown from "react-markdown";

export function Markdown({
  components,
  ...props
}: React.ComponentPropsWithRef<typeof ReactMarkdown>) {
  return <ReactMarkdown {...props} components={{ a: MdA, ...components }} />;
}

function MdA({
  href = "#",
  target = "_blank",
  ...props
}: React.ComponentPropsWithRef<"a">) {
  return <Link {...props} href={href} target={target} />;
}
