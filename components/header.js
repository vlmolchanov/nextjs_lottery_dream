import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    // https://tailwindcss.com/docs
    // nav is a section with navigation links
    // h1 - is a header. h1-h6. h1 - is a highest rank
    // div - is a generic container
    // "p-{size}" = add padding to all sides
    // "px-{size}" = control horizontal padding of an element
    // "py-{size}" = control vertical padding of an element
    // "font" = Control the font weight of an element
    // "text-size" = Size of the text
    // "ml-auto" = "m" is margin, "l" is side, "auto" it's size. Looks like auto is to put it on the right side
    // "border-{side}-2" = border with it's side and width
    // "flex" = Use flex-row to position flex items horizontally in the same direction as text
    <nav className="p-5 border-b-2 flex flex-row">
      <h1 className="py-4 px-10 font-bold text-4xl"> Lottery of Dream</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
