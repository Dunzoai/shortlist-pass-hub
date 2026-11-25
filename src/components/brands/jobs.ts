/**
 * /brands — every job's words in ONE place (Marc's approved mockup, ~/Downloads/shorty-manager-landing-final.html).
 * Adding a job = adding one entry to JOBS (and its key to JOB_ORDER). Photos: a job with `img: []` draws the mockup's coloured
 * blocks; giving it photos is a one-line change (four URLs: the hero photo, then three small ones).
 *
 * The shift log and the text thread are an EXAMPLE DAY (the page says so under the log: "Example day. Your numbers will be your own.").
 */
export type JobKey = 'baker' | 'realtor' | 'barber' | 'trainer' | 'any';
export type Job = {
  chip: string;
  /** the hero headline's first line */
  verb: string;
  /** "What's left on your plate" */
  one: string;
  /** the sample business on the devices and the badge */
  biz: string;
  day: string;
  /** the sample site's headline and button */
  head: string;
  cta: string;
  /** accent (text on it is white, ≥ 4.5:1) and the dark band of the sample site */
  accent: string;
  dark: string;
  /** the sample app's tab bar */
  tabs: string[];
  /** sample photos: [hero, small, small, small]; [] = coloured blocks */
  img: string[];
  /** the shift log: [time, kind, what happened, tag] */
  log: Array<[string, string, string, string]>;
  late: string;
  /** the text thread: u = the owner, s = Shorty */
  chat: Array<['u' | 's', string]>;
};

const SAMPLES = 'https://njxydstcfczirnpskvad.supabase.co/storage/v1/object/public/smartpage-gallery/samples';

export const JOB_ORDER: JobKey[] = ['baker', 'realtor', 'barber', 'trainer', 'any'];

export const JOBS: Record<JobKey, Job> = {
  baker: {
    chip: 'Baker', verb: 'You bake.', one: 'Bake', biz: "Sweet Sadie's", day: 'Tuesday',
    head: 'Baked at home, made for your table.', cta: 'Order now', accent: '#B44C31', dark: '#3a2318', tabs: ['Home', 'Cakes', 'Order', 'Pickup'],
    img: [`${SAMPLES}/home_baker/cake-1.jpg`, `${SAMPLES}/home_baker/cake-2.jpg`, `${SAMPLES}/home_baker/cake-3.jpg`, `${SAMPLES}/home_baker/lemon-bars.jpg`],
    log: [
      ['6:30 AM', 'Social', "Posted today's menu to Instagram and Facebook", ''],
      ['8:12 AM', 'Orders', 'Took an order for a dozen cupcakes', '+$30'],
      ['10:40 AM', 'Questions', 'Answered “Do you do gluten-free?” for 3 people', ''],
      ['1:05 PM', 'Bookings', 'Booked a Saturday pickup for the Hendersons', ''],
      ['3:20 PM', 'Texts', 'Told 86 regulars the lemon bars are back', '4 orders'],
      ['5:45 PM', 'Regulars', "Sent a little “we miss you” to 12 people who haven't ordered lately", ''],
      ['9:00 PM', 'Numbers', "Sent you today's report: 9 orders", '$264'],
    ],
    late: '2:14 AM · Still up. Just took another order.',
    chat: [['u', "How'd we do today?"], ['s', '9 orders, $264. Lemon bars sold out by noon again.'], ['s', "Want me to tell your regulars you're doubling Saturday's batch?"], ['u', 'Do it'], ['s', 'Done. Texted 86 regulars. 4 pre-orders so far.']],
  },
  realtor: {
    chip: 'Realtor', verb: 'You sell homes.', one: 'Sell homes', biz: 'Dana Cole Homes', day: 'Tuesday',
    head: 'Find the right street, not just the right house.', cta: 'Book a call', accent: '#2F5D8A', dark: '#16283A', tabs: ['Home', 'Listings', 'Book', 'Contact'],
    img: [`${SAMPLES}/realtor/house-1.jpg`, `${SAMPLES}/realtor/house-2.jpg`, `${SAMPLES}/realtor/house-3.jpg`, `${SAMPLES}/realtor/house-4.jpg`],
    log: [
      ['7:00 AM', 'Social', 'Posted the new Carolina Forest listing to Instagram and Facebook', ''],
      ['9:20 AM', 'Bookings', 'Booked a 4 PM showing for the Parkers', ''],
      ['11:05 AM', 'Questions', 'Answered “What’s the HOA fee?” on two listings', ''],
      ['2:30 PM', 'Texts', "Told 40 buyers about Saturday's open house", '9 RSVPs'],
      ['4:45 PM', 'Follow-up', "Checked in with 6 people from last week's open house", ''],
      ['8:10 PM', 'Leads', 'Took a home-value request while you were at dinner', 'New lead'],
      ['9:00 PM', 'Numbers', "Sent you this week's report: 14 leads, 5 showings", ''],
    ],
    late: '11:48 PM · Still up. Just answered a buyer.',
    chat: [['u', 'Anything while I was at the closing?'], ['s', '3 new leads. I booked the Parkers for 4 PM tomorrow at Maple St.'], ['s', 'Want me to post the price drop on Oak Ave?'], ['u', 'Yes'], ['s', 'Posted to Instagram and Facebook. Texted 40 buyers too.']],
  },
  barber: {
    chip: 'Barber', verb: 'You cut hair.', one: 'Cut hair', biz: 'Fade Factory', day: 'Tuesday',
    head: 'Sharp cuts. No waiting around.', cta: 'Book a cut', accent: '#8A5A2F', dark: '#1E1B18', tabs: ['Home', 'Cuts', 'Book', 'Shop'],
    img: [],
    log: [
      ['8:00 AM', 'Social', "Posted today's open chairs to Instagram", ''],
      ['9:15 AM', 'Bookings', 'Booked 4 cuts before you unlocked the door', '+$140'],
      ['11:30 AM', 'Questions', 'Answered “Do you do kids’ cuts?”', ''],
      ['1:50 PM', 'Bookings', 'Filled the 2 PM that cancelled', '+$35'],
      ['4:00 PM', 'Texts', "Reminded 22 regulars they're due for a trim", '6 booked'],
      ['7:30 PM', 'Regulars', 'Gave Marcus his 10th-cut reward', ''],
      ['9:00 PM', 'Numbers', "Sent you today's report: 11 cuts", '$385'],
    ],
    late: '1:20 AM · Still up. Just booked Thursday at 10.',
    chat: [['u', "How's tomorrow looking?"], ['s', 'Booked solid till 3. The 2 PM cancelled, so I filled it.'], ['s', '22 regulars are due for a trim. Want me to nudge them?'], ['u', 'Go'], ['s', 'Sent. 6 booked already.']],
  },
  trainer: {
    chip: 'Trainer', verb: 'You train.', one: 'Train clients', biz: 'Coach Riley', day: 'Tuesday',
    head: "Stronger by summer. Let's go.", cta: 'Book a session', accent: '#2F7A47', dark: '#14231A', tabs: ['Home', 'Plans', 'Book', 'Results'],
    img: [],
    log: [
      ['6:00 AM', 'Social', "Posted Jen's 12-week win to Instagram", ''],
      ['8:40 AM', 'Bookings', 'Booked 3 sessions for next week', '+$210'],
      ['10:15 AM', 'Questions', 'Answered “How much is a month?” for 2 people', ''],
      ['12:30 PM', 'Texts', "Reminded tomorrow's 6 AM group to bring water", ''],
      ['3:10 PM', 'Regulars', 'Reached out to 5 clients who went quiet', '2 rebooked'],
      ['6:45 PM', 'Bookings', 'Signed up a new client for the starter plan', '+$120'],
      ['9:00 PM', 'Numbers', "Sent you this week's report: 18 sessions", '$1,260'],
    ],
    late: '11:02 PM · Still up. Just answered a new lead.',
    chat: [['u', 'How was this week?'], ['s', '18 sessions, $1,260. Two clients went quiet.'], ['s', 'Want me to check in on them?'], ['u', 'Please'], ['s', 'Done. Jen rebooked for Monday.']],
  },
  any: {
    chip: 'Something else', verb: 'You do the work.', one: 'Do the work you love', biz: 'Your Business', day: 'Tuesday',
    head: 'Tell us what you do. Your page shows up built.', cta: 'Get in touch', accent: '#16140F', dark: '#24221C', tabs: ['Home', 'Work', 'Book', 'Contact'],
    img: [],
    log: [
      ['7:00 AM', 'Social', 'Posted your latest work to Instagram and Facebook', ''],
      ['9:30 AM', 'Orders', 'Took an order while you were busy', '+$45'],
      ['11:00 AM', 'Questions', 'Answered the question you get ten times a day', ''],
      ['1:15 PM', 'Bookings', 'Booked two appointments', ''],
      ['3:40 PM', 'Texts', "Told your regulars what's new", '5 replies'],
      ['6:00 PM', 'Regulars', "Nudged the customers you haven't seen in a while", ''],
      ['9:00 PM', 'Numbers', "Sent you today's report", ''],
    ],
    late: '2:00 AM · Still up. Still answering.',
    chat: [['u', "How'd today go?"], ['s', '5 orders and 2 bookings. I answered 11 questions.'], ['s', "Want me to post today's work?"], ['u', 'Sure'], ['s', "Posted. I'll send you the numbers at 9."]],
  },
};

/** the twelve jobs that fly from "Your plate" to "Shorty's plate" */
export const TWELVE = ['Build a website', 'Build an app', 'Post to Instagram', 'Answer late-night DMs', 'Take orders', 'Book appointments', 'Text customers', 'Send emails', 'Show up on Google', 'Show up in ChatGPT', 'Bring back regulars', 'Track the numbers'];

export const SIGNUP_HREF = 'https://app.shortlistpass.com/freeshorty?type=brand';
export const SIGNIN_HREF = 'https://app.shortlistpass.com';
