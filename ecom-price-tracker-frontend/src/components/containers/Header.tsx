import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="w-full flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            {/* <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                {title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" /> */}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
