export type SlotName =
  | 'student.dashboard.widget'
  | 'student.marketplace.listing'
  | 'creator.dashboard.widget'
  | 'creator.marketplace.listing'
  | 'creator.nav.section'
  | 'parent.hub.tile'
  | 'parent.marketplace.listing'
  | 'parent.nav.section'
  | 'org.nav.section'
  | 'org.plugins.listing';

export interface SlotContribution {
  id: string;
  component: (props: Record<string, unknown>) => unknown;
  props?: Record<string, unknown>;
}
