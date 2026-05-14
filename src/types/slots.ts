// All named extension slots across the four Learnershood web apps.
// Keep in sync with each app's slotRegistry.
export type SlotName =
  // Students web
  | 'student.nav.item'
  | 'student.activity'
  | 'student.course.blockType'
  | 'student.dashboard.widget'
  // Creators web
  | 'creator.nav.section'
  | 'creator.tool'
  | 'creator.lecture.blockType'
  | 'creator.dashboard.widget'
  // Parents web
  | 'parent.nav.item'
  | 'parent.child.tab'
  | 'parent.inbox.type'
  // Organisations web
  | 'org.nav.section'
  | 'org.dashboard.widget'
  | 'org.settings.tab';

export interface SlotContribution {
  id: string;
  component: (props: Record<string, unknown>) => unknown;
  props?: Record<string, unknown>;
}
