import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },
{
    navCap: 'Manage Data',
    divider: true
  },
 {
  displayName: 'Users',
  iconName: 'mdi:account', // Material Design user icon
  route: '/managements/users',
},{
  displayName: 'Agencies',
  iconName: 'mdi:office-building', // Material Design office building icon
  route: '/managements/agences',
}
,{
  displayName: 'Properties',
  iconName: 'mdi:home', // Material Design user icon
  route: '/managements/properties',
},{
  displayName: 'Transactions',
 iconName: 'mdi:credit-card', // pour représenter un transfert/transaction
  route: '/managements/transactions',
}
];
