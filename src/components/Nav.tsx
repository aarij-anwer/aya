import { NavLink } from './NavLink';

export interface NavProps {
  href: string;
  children: React.ReactNode;
}

export default function Nav({ props }: { props: NavProps[] }) {
  return props.map((prop, index) => (
    <NavLink href={prop.href} key={index}>
      {prop.children}
    </NavLink>
  ));
}
