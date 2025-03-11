
import { MainNav } from "./MainNav";

export const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <MainNav />
      </div>
    </header>
  );
};
