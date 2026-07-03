import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Calculator,
  Calendar as CalendarIcon,
  Check,
  CreditCard,
  Send,
  Settings,
  Smile,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// A tiny deterministic bar chart (used by the Move Goal card here and by the
// Charts beat in the category montage).
// ---------------------------------------------------------------------------
export const MiniBars: React.FC<{
  values: number[];
  height: number;
  barWidth?: number;
  gap?: number;
  color?: string;
  stagger?: number;
}> = ({ values, height, barWidth = 14, gap = 8, color = "#52525b", stagger = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height }}>
      {values.map((v, i) => {
        const grow = spring({
          frame: frame - i * stagger,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.8 },
        });
        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: Math.max(3, (v / max) * height * grow),
              borderRadius: 4,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// The component field — the ui.shadcn.com homepage cards, packed tight.
// ---------------------------------------------------------------------------
const SELECTED_DAY = new Date(2026, 6, 3);

const CreateAccountCard = (
  <Card>
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>Enter your email below to get started</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">GitHub</Button>
        <Button variant="outline">Google</Button>
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-email">Email</Label>
        <Input id="fld-email" placeholder="m@example.com" readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-pass">Password</Label>
        <Input id="fld-pass" type="password" defaultValue="password" readOnly />
      </div>
      <Button className="w-full">Create account</Button>
    </CardContent>
  </Card>
);

const PaymentCard = (
  <Card>
    <CardHeader>
      <CardTitle>Payment method</CardTitle>
      <CardDescription>All transactions are secure</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-card-name">Name</Label>
        <Input id="fld-card-name" defaultValue="First Last" readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-card-num">Card number</Label>
        <div className="relative">
          <Input id="fld-card-num" defaultValue="1234 1234 1234 1234" readOnly />
          <CreditCard className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input defaultValue="06/28" readOnly />
        <Input defaultValue="CVC" readOnly />
        <Input defaultValue="90210" readOnly />
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Save</Button>
    </CardFooter>
  </Card>
);

const TeamCard = (
  <Card>
    <CardHeader>
      <CardTitle>Team members</CardTitle>
      <CardDescription>Invite your team to collaborate.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      {[
        { initials: "SD", name: "Sofia Davis", email: "m@example.com", role: "Owner" },
        { initials: "JL", name: "Jackson Lee", email: "p@example.com", role: "Member" },
        { initials: "IN", name: "Isabella Nguyen", email: "i@example.com", role: "Member" },
      ].map((m) => (
        <div key={m.initials} className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{m.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm">{m.name}</span>
            <span className="text-xs text-muted-foreground">{m.email}</span>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            {m.role}
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ChatCard = (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>Sofia Davis</CardTitle>
          <CardDescription>m@example.com</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="max-w-[85%] self-start rounded-lg bg-muted px-3 py-2 text-sm">
        Hi, how can I help you today?
      </div>
      <div className="max-w-[85%] self-end rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
        Hey, I&apos;m having trouble with my account.
      </div>
      <div className="max-w-[85%] self-start rounded-lg bg-muted px-3 py-2 text-sm">
        What seems to be the problem?
      </div>
      <div className="max-w-[85%] self-end rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
        I can&apos;t log in.
      </div>
    </CardContent>
    <CardFooter className="gap-2">
      <Input placeholder="Type your message..." readOnly className="flex-1" />
      <Button size="icon">
        <Send />
      </Button>
    </CardFooter>
  </Card>
);

const MoveGoalCard = (
  <Card>
    <CardHeader>
      <CardTitle>Move goal</CardTitle>
      <CardDescription>Set your daily activity goal.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl tracking-normal">350</span>
        <span className="text-xs text-muted-foreground">calories/day</span>
      </div>
      <MiniBars
        values={[40, 70, 52, 88, 60, 76, 96, 58, 70, 82, 64, 90]}
        height={64}
        barWidth={16}
        gap={7}
        color="#3f3f46"
      />
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        Set goal
      </Button>
    </CardFooter>
  </Card>
);

const CalendarCard = (
  <Calendar
    mode="single"
    selected={SELECTED_DAY}
    month={SELECTED_DAY}
    today={SELECTED_DAY}
    className="w-full rounded-xl border border-border bg-card [&_td_button]:text-white [&_td_button[data-selected-single=true]]:text-zinc-950"
  />
);

const CookieCard = (
  <Card>
    <CardHeader>
      <CardTitle>Cookie settings</CardTitle>
      <CardDescription>Manage your cookie settings here.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fld-necessary">Strictly necessary</Label>
          <span className="text-xs text-muted-foreground">
            Essential for the website to function.
          </span>
        </div>
        <Switch id="fld-necessary" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fld-functional">Functional cookies</Label>
          <span className="text-xs text-muted-foreground">
            Personalized features and content.
          </span>
        </div>
        <Switch id="fld-functional" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="fld-perf">Performance cookies</Label>
          <span className="text-xs text-muted-foreground">
            Help us improve the website.
          </span>
        </div>
        <Switch id="fld-perf" defaultChecked />
      </div>
    </CardContent>
  </Card>
);

const ReportCard = (
  <Card>
    <CardHeader>
      <CardTitle>Report an issue</CardTitle>
      <CardDescription>What area are you having problems with?</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label>Area</Label>
          <Select defaultValue="billing">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Billing" />
            </SelectTrigger>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Severity</Label>
          <Select defaultValue="s2">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Severity 2" />
            </SelectTrigger>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-subject">Subject</Label>
        <Input id="fld-subject" defaultValue="I need help with..." readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fld-desc">Description</Label>
        <Textarea
          id="fld-desc"
          placeholder="Please include all information relevant to your issue."
          readOnly
        />
      </div>
    </CardContent>
    <CardFooter className="justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Submit</Button>
    </CardFooter>
  </Card>
);

const ShareCard = (
  <Card>
    <CardHeader>
      <CardTitle>Share this document</CardTitle>
      <CardDescription>Anyone with the link can view.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input defaultValue="http://example.com/link/to/document" readOnly className="flex-1" />
        <Button variant="secondary">Copy</Button>
      </div>
      <Separator />
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm">Olivia Martin</span>
          <span className="text-xs text-muted-foreground">m@example.com</span>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          Can edit
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CommandCard = (
  <Command className="rounded-xl border border-border" value="Calendar">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <CalendarIcon />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem>
          <Smile />
          <span>Search emoji</span>
        </CommandItem>
        <CommandItem>
          <Calculator />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <User />
          <span>Profile</span>
        </CommandItem>
        <CommandItem>
          <CreditCard />
          <span>Billing</span>
        </CommandItem>
        <CommandItem>
          <Settings />
          <span>Settings</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

const PlanCard = (
  <Card>
    <CardHeader>
      <CardTitle>Upgrade your plan</CardTitle>
      <CardDescription>Pick what fits your team.</CardDescription>
    </CardHeader>
    <CardContent>
      <RadioGroup defaultValue="pro" className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="hobby" id="fld-hobby" />
          <Label htmlFor="fld-hobby">Hobby</Label>
          <span className="ml-auto text-sm text-muted-foreground">$0</span>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="pro" id="fld-pro" />
          <Label htmlFor="fld-pro">Pro</Label>
          <span className="ml-auto text-sm text-muted-foreground">$20</span>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="team" id="fld-team" />
          <Label htmlFor="fld-team">Team</Label>
          <span className="ml-auto text-sm text-muted-foreground">$100</span>
        </div>
      </RadioGroup>
    </CardContent>
    <CardFooter>
      <Button className="w-full">
        <Check /> Upgrade
      </Button>
    </CardFooter>
  </Card>
);

const ExerciseCard = (
  <Card>
    <CardHeader>
      <CardDescription>Exercise minutes</CardDescription>
      <CardTitle className="text-3xl">1,284</CardTitle>
    </CardHeader>
    <CardContent>
      <MiniBars
        values={[38, 62, 44, 78, 52, 70, 88, 58, 72, 84, 60, 92]}
        height={110}
        barWidth={22}
        gap={8}
        color="#52525b"
      />
    </CardContent>
  </Card>
);

const PaymentsTableCard = (
  <Card className="py-4">
    <CardContent className="px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>INV003</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell className="text-right">$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const TabsCard = (
  <Tabs defaultValue="account" className="w-full">
    <TabsList className="w-full">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Make changes to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="fld-tab-name">Name</Label>
          <Input id="fld-tab-name" defaultValue="shadcn" readOnly />
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

const StatusCard = (
  <Card>
    <CardHeader>
      <CardTitle>Deployment status</CardTitle>
      <CardDescription>Your latest builds at a glance.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">production</span>
        <Badge>Ready</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">preview</span>
        <Badge variant="secondary">Building</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">staging</span>
        <Badge variant="outline">Queued</Badge>
      </div>
    </CardContent>
  </Card>
);

const PlayerCard = (
  <Card>
    <CardHeader>
      <CardTitle>Now playing</CardTitle>
      <CardDescription>Adjust playback and levels.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-5">
      <Slider defaultValue={[60]} max={100} />
      <Progress value={42} />
      <div className="flex items-center gap-2">
        <Toggle defaultPressed aria-label="Shuffle">
          Shuffle
        </Toggle>
        <Toggle aria-label="Repeat">Repeat</Toggle>
        <Toggle aria-label="Mute">Mute</Toggle>
      </div>
    </CardContent>
  </Card>
);

const StorageCard = (
  <Card>
    <CardHeader>
      <CardTitle>Storage</CardTitle>
      <CardDescription>82.4 GB of 100 GB used</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Progress value={82} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Documents</span>
        <span className="text-sm">24.1 GB</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Media</span>
        <span className="text-sm">51.6 GB</span>
      </div>
    </CardContent>
  </Card>
);

const FeedbackCard = (
  <Card>
    <CardHeader>
      <CardTitle>Send feedback</CardTitle>
      <CardDescription>Help us improve your experience.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Textarea placeholder="Tell us what you think..." readOnly />
      <div className="flex justify-end">
        <Button size="sm">Send</Button>
      </div>
    </CardContent>
  </Card>
);

// Order matters: CSS columns fill left to right, so the first cards land in
// the leftmost columns where the camera opens. The tail cards keep every
// column tall enough that the end of the glide never sees an empty bottom.
const FIELD_CARDS: React.ReactNode[] = [
  CreateAccountCard,
  MoveGoalCard,
  ChatCard,
  CalendarCard,
  CommandCard,
  ExerciseCard,
  PaymentCard,
  CookieCard,
  TeamCard,
  PaymentsTableCard,
  ReportCard,
  ShareCard,
  PlanCard,
  TabsCard,
  StatusCard,
  PlayerCard,
  StorageCard,
  FeedbackCard,
];

// ---------------------------------------------------------------------------
// Camera: no pull-back — one continuous diagonal glide across the packed
// wall, top-left to bottom-right, with a slight push-in. The plane is a
// 4-column CSS-columns masonry, ~1720px wide — dense, homepage-like.
// ---------------------------------------------------------------------------
const PLANE_W = 1720;
const PLANE_H = 1620;

// One single-segment glide: no keyframe joints mid-flight, so the camera
// never halts — it is still moving when the swirl cover takes over at ~4s.
const CAM_T = [0, 224];
const CAM_X = [620, 1105];
const CAM_Y = [360, 900];
const CAM_S = [1.02, 1.1];

const camEasing = Easing.inOut(Easing.cubic);

export const FieldScene: React.FC = () => {
  const frame = useCurrentFrame();

  const px = interpolate(frame, CAM_T, CAM_X, {
    ...clampOpts,
    easing: camEasing,
  });
  const py = interpolate(frame, CAM_T, CAM_Y, {
    ...clampOpts,
    easing: camEasing,
  });
  const s = interpolate(frame, CAM_T, CAM_S, {
    ...clampOpts,
    easing: camEasing,
  });
  const rotate = interpolate(frame, [0, 224], [-1.0, 0.4], clampOpts);

  const tx = 640 - px * s;
  const ty = 360 - py * s;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${rotate}deg)` }}>
        <div
          className="dark **:font-normal!"
          style={{
            position: "absolute",
            width: PLANE_W,
            transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            transformOrigin: "0 0",
          }}
        >
          <div className="columns-4 gap-5 p-5">
            {FIELD_CARDS.map((node, i) => {
              // Cards assemble as a quick left-to-right wave: the opening
              // close-up is already set, the far columns land before the
              // pull-back reveals them.
              const d = 2 + i * 5;
              const enter = interpolate(frame, [d, d + 12], [0, 1], {
                ...clampOpts,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={i}
                  className="mb-5 break-inside-avoid"
                  style={{
                    opacity: enter,
                    transform: `translateY(${(1 - enter) * 22}px) scale(${
                      0.97 + enter * 0.03
                    })`,
                  }}
                >
                  {node}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { PLANE_H };
export const S_FIELD = 224;
