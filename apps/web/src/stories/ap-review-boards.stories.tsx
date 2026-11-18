import {
	Checkbox,
	FormField,
	IconButton,
	OtpField,
	PasswordField,
	ProjectActions,
	SelectField,
	Switch,
	Textarea,
} from "@agentplace/ui/components/ap-controls";
import {
	Avatar,
	Badge,
	CapabilityRow,
	CreditBalance,
	CreditRing,
	LibraryItem,
	Spinner,
	StaffRow,
	Surface,
	VersionRow,
} from "@agentplace/ui/components/ap-data";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

const boards = [
	{
		id: "210:1970",
		name: "03 · Actions",
		width: "2600",
		height: "784",
		items: [
			{
				id: "32:43",
				name: "Button / Primary",
				x: 32.0,
				y: 128.0,
				items: [
					{
						id: "32:31",
						name: "Size=Small, State=Default",
						x: "32",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:32",
						name: "Size=Small, State=Hover",
						x: "185",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:33",
						name: "Size=Small, State=Pressed",
						x: "338",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:34",
						name: "Size=Small, State=Focus",
						x: "491",
						y: "32",
						width: "89",
						height: "32",
					},
					{
						id: "32:35",
						name: "Size=Small, State=Disabled",
						x: "644",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:36",
						name: "Size=Small, State=Loading",
						x: "797",
						y: "32",
						width: "109",
						height: "32",
					},
					{
						id: "32:37",
						name: "Size=Medium, State=Default",
						x: "32",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:38",
						name: "Size=Medium, State=Hover",
						x: "185",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:39",
						name: "Size=Medium, State=Pressed",
						x: "338",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:40",
						name: "Size=Medium, State=Focus",
						x: "491",
						y: "104",
						width: "97",
						height: "40",
					},
					{
						id: "32:41",
						name: "Size=Medium, State=Disabled",
						x: "644",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:42",
						name: "Size=Medium, State=Loading",
						x: "797",
						y: "104",
						width: "121",
						height: "40",
					},
				],
			},
			{
				id: "32:152",
				name: "Button / Secondary",
				x: 1030.0,
				y: 128.0,
				items: [
					{
						id: "32:140",
						name: "Size=Small, State=Default",
						x: "32",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:141",
						name: "Size=Small, State=Hover",
						x: "185",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:142",
						name: "Size=Small, State=Pressed",
						x: "338",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:143",
						name: "Size=Small, State=Focus",
						x: "491",
						y: "32",
						width: "89",
						height: "32",
					},
					{
						id: "32:144",
						name: "Size=Small, State=Disabled",
						x: "644",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:145",
						name: "Size=Small, State=Loading",
						x: "797",
						y: "32",
						width: "109",
						height: "32",
					},
					{
						id: "32:146",
						name: "Size=Medium, State=Default",
						x: "32",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:147",
						name: "Size=Medium, State=Hover",
						x: "185",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:148",
						name: "Size=Medium, State=Pressed",
						x: "338",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:149",
						name: "Size=Medium, State=Focus",
						x: "491",
						y: "104",
						width: "97",
						height: "40",
					},
					{
						id: "32:150",
						name: "Size=Medium, State=Disabled",
						x: "644",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:151",
						name: "Size=Medium, State=Loading",
						x: "797",
						y: "104",
						width: "121",
						height: "40",
					},
				],
			},
			{
				id: "32:261",
				name: "Button / Ghost",
				x: 32.0,
				y: 392.0,
				items: [
					{
						id: "32:249",
						name: "Size=Small, State=Default",
						x: "32",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:250",
						name: "Size=Small, State=Hover",
						x: "185",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:251",
						name: "Size=Small, State=Pressed",
						x: "338",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:252",
						name: "Size=Small, State=Focus",
						x: "491",
						y: "32",
						width: "89",
						height: "32",
					},
					{
						id: "32:253",
						name: "Size=Small, State=Disabled",
						x: "644",
						y: "32",
						width: "85",
						height: "32",
					},
					{
						id: "32:254",
						name: "Size=Small, State=Loading",
						x: "797",
						y: "32",
						width: "109",
						height: "32",
					},
					{
						id: "32:255",
						name: "Size=Medium, State=Default",
						x: "32",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:256",
						name: "Size=Medium, State=Hover",
						x: "185",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:257",
						name: "Size=Medium, State=Pressed",
						x: "338",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:258",
						name: "Size=Medium, State=Focus",
						x: "491",
						y: "104",
						width: "97",
						height: "40",
					},
					{
						id: "32:259",
						name: "Size=Medium, State=Disabled",
						x: "644",
						y: "104",
						width: "93",
						height: "40",
					},
					{
						id: "32:260",
						name: "Size=Medium, State=Loading",
						x: "797",
						y: "104",
						width: "121",
						height: "40",
					},
				],
			},
			{
				id: "32:370",
				name: "Button / Danger",
				x: 1030.0,
				y: 392.0,
				items: [
					{
						id: "32:358",
						name: "Size=Small, State=Default",
						x: "32",
						y: "32",
						width: "93",
						height: "32",
					},
					{
						id: "32:359",
						name: "Size=Small, State=Hover",
						x: "190",
						y: "32",
						width: "93",
						height: "32",
					},
					{
						id: "32:360",
						name: "Size=Small, State=Pressed",
						x: "348",
						y: "32",
						width: "93",
						height: "32",
					},
					{
						id: "32:361",
						name: "Size=Small, State=Focus",
						x: "506",
						y: "32",
						width: "97",
						height: "32",
					},
					{
						id: "32:362",
						name: "Size=Small, State=Disabled",
						x: "664",
						y: "32",
						width: "93",
						height: "32",
					},
					{
						id: "32:363",
						name: "Size=Small, State=Loading",
						x: "822",
						y: "32",
						width: "117",
						height: "32",
					},
					{
						id: "32:364",
						name: "Size=Medium, State=Default",
						x: "32",
						y: "104",
						width: "101",
						height: "40",
					},
					{
						id: "32:365",
						name: "Size=Medium, State=Hover",
						x: "190",
						y: "104",
						width: "101",
						height: "40",
					},
					{
						id: "32:366",
						name: "Size=Medium, State=Pressed",
						x: "348",
						y: "104",
						width: "101",
						height: "40",
					},
					{
						id: "32:367",
						name: "Size=Medium, State=Focus",
						x: "506",
						y: "104",
						width: "105",
						height: "40",
					},
					{
						id: "32:368",
						name: "Size=Medium, State=Disabled",
						x: "664",
						y: "104",
						width: "101",
						height: "40",
					},
					{
						id: "32:369",
						name: "Size=Medium, State=Loading",
						x: "822",
						y: "104",
						width: "129",
						height: "40",
					},
				],
			},
			{
				id: "32:479",
				name: "Icon button",
				x: 2058.0,
				y: 392.0,
				items: [
					{
						id: "32:467",
						name: "Size=Small, State=Default",
						x: "32",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:468",
						name: "Size=Small, State=Hover",
						x: "96",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:469",
						name: "Size=Small, State=Pressed",
						x: "160",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:470",
						name: "Size=Small, State=Focus",
						x: "224",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:471",
						name: "Size=Small, State=Disabled",
						x: "288",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:472",
						name: "Size=Small, State=Loading",
						x: "352",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:473",
						name: "Size=Medium, State=Default",
						x: "32",
						y: "104",
						width: "40",
						height: "40",
					},
					{
						id: "32:474",
						name: "Size=Medium, State=Hover",
						x: "96",
						y: "104",
						width: "40",
						height: "40",
					},
					{
						id: "32:475",
						name: "Size=Medium, State=Pressed",
						x: "160",
						y: "104",
						width: "40",
						height: "40",
					},
					{
						id: "32:476",
						name: "Size=Medium, State=Focus",
						x: "224",
						y: "104",
						width: "40",
						height: "40",
					},
					{
						id: "32:477",
						name: "Size=Medium, State=Disabled",
						x: "288",
						y: "104",
						width: "40",
						height: "40",
					},
					{
						id: "32:478",
						name: "Size=Medium, State=Loading",
						x: "352",
						y: "104",
						width: "40",
						height: "40",
					},
				],
			},
			{
				id: "108:1306",
				name: "Product / Project actions",
				x: 32.0,
				y: 656.0,
				items: [
					{
						id: "107:1368",
						name: "State=Default",
						x: "24",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "107:1376",
						name: "State=Hover",
						x: "104",
						y: "32",
						width: "32",
						height: "32",
					},
				],
			},
		],
	},
	{
		id: "210:1978",
		name: "04 · Forms & selection",
		width: "2600",
		height: "936",
		items: [
			{
				id: "32:532",
				name: "Input",
				x: 32.0,
				y: 128.0,
				items: [
					{
						id: "32:526",
						name: "State=Default",
						x: "32",
						y: "32",
						width: "320",
						height: "100",
					},
					{
						id: "32:527",
						name: "State=Hover",
						x: "384",
						y: "32",
						width: "320",
						height: "100",
					},
					{
						id: "32:528",
						name: "State=Focus",
						x: "736",
						y: "32",
						width: "320",
						height: "100",
					},
					{
						id: "32:529",
						name: "State=Filled",
						x: "32",
						y: "164",
						width: "320",
						height: "100",
					},
					{
						id: "32:530",
						name: "State=Error",
						x: "384",
						y: "164",
						width: "320",
						height: "100",
					},
					{
						id: "32:531",
						name: "State=Disabled",
						x: "736",
						y: "164",
						width: "320",
						height: "100",
					},
				],
			},
			{
				id: "32:569",
				name: "Textarea",
				x: 1168.0,
				y: 128.0,
				items: [
					{
						id: "32:563",
						name: "State=Default",
						x: "32",
						y: "32",
						width: "320",
						height: "148",
					},
					{
						id: "32:564",
						name: "State=Hover",
						x: "384",
						y: "32",
						width: "320",
						height: "148",
					},
					{
						id: "32:565",
						name: "State=Focus",
						x: "736",
						y: "32",
						width: "320",
						height: "148",
					},
					{
						id: "32:566",
						name: "State=Filled",
						x: "32",
						y: "212",
						width: "320",
						height: "148",
					},
					{
						id: "32:567",
						name: "State=Error",
						x: "384",
						y: "212",
						width: "320",
						height: "148",
					},
					{
						id: "32:568",
						name: "State=Disabled",
						x: "736",
						y: "212",
						width: "320",
						height: "148",
					},
				],
			},
			{
				id: "32:600",
				name: "Select",
				x: 32.0,
				y: 608.0,
				items: [
					{
						id: "32:594",
						name: "State=Default",
						x: "32",
						y: "32",
						width: "320",
						height: "92",
					},
					{
						id: "32:595",
						name: "State=Hover",
						x: "384",
						y: "32",
						width: "320",
						height: "92",
					},
					{
						id: "32:596",
						name: "State=Focus",
						x: "736",
						y: "32",
						width: "320",
						height: "92",
					},
					{
						id: "32:597",
						name: "State=Filled",
						x: "32",
						y: "156",
						width: "320",
						height: "92",
					},
					{
						id: "32:598",
						name: "State=Error",
						x: "384",
						y: "156",
						width: "320",
						height: "92",
					},
					{
						id: "32:599",
						name: "State=Disabled",
						x: "736",
						y: "156",
						width: "320",
						height: "92",
					},
				],
			},
			{
				id: "51:1022",
				name: "Product / Password field",
				x: 1168.0,
				y: 608.0,
				items: [
					{
						id: "51:1022",
						name: "Default",
						x: "0",
						y: "0",
						width: "336",
						height: "74",
					},
				],
			},
			{
				id: "185:1606",
				name: "Form / Six-digit OTP",
				x: 1552.0,
				y: 608.0,
				items: [
					{
						id: "185:1607",
						name: "State=Empty",
						x: "16",
						y: "40",
						width: "336",
						height: "48",
					},
					{
						id: "185:1638",
						name: "State=Complete",
						x: "16",
						y: "120",
						width: "336",
						height: "48",
					},
					{
						id: "185:1669",
						name: "State=Processing",
						x: "16",
						y: "200",
						width: "336",
						height: "48",
					},
				],
			},
			{
				id: "32:671",
				name: "Checkbox",
				x: 1968.0,
				y: 608.0,
				items: [
					{
						id: "32:663",
						name: "Checked=Off, State=Default",
						x: "32",
						y: "32",
						width: "20",
						height: "20",
					},
					{
						id: "32:664",
						name: "Checked=Off, State=Hover",
						x: "84",
						y: "32",
						width: "20",
						height: "20",
					},
					{
						id: "32:665",
						name: "Checked=Off, State=Focus",
						x: "136",
						y: "32",
						width: "20",
						height: "20",
					},
					{
						id: "32:666",
						name: "Checked=Off, State=Disabled",
						x: "188",
						y: "32",
						width: "20",
						height: "20",
					},
					{
						id: "32:667",
						name: "Checked=On, State=Default",
						x: "32",
						y: "84",
						width: "20",
						height: "20",
					},
					{
						id: "32:668",
						name: "Checked=On, State=Hover",
						x: "84",
						y: "84",
						width: "20",
						height: "20",
					},
					{
						id: "32:669",
						name: "Checked=On, State=Focus",
						x: "136",
						y: "84",
						width: "20",
						height: "20",
					},
					{
						id: "32:670",
						name: "Checked=On, State=Disabled",
						x: "188",
						y: "84",
						width: "20",
						height: "20",
					},
				],
			},
			{
				id: "32:692",
				name: "Switch",
				x: 2256.0,
				y: 608.0,
				items: [
					{
						id: "32:684",
						name: "Checked=Off, State=Default",
						x: "32",
						y: "32",
						width: "36",
						height: "20",
					},
					{
						id: "32:685",
						name: "Checked=Off, State=Hover",
						x: "100",
						y: "32",
						width: "36",
						height: "20",
					},
					{
						id: "32:686",
						name: "Checked=Off, State=Focus",
						x: "168",
						y: "32",
						width: "36",
						height: "20",
					},
					{
						id: "32:687",
						name: "Checked=Off, State=Disabled",
						x: "236",
						y: "32",
						width: "36",
						height: "20",
					},
					{
						id: "32:688",
						name: "Checked=On, State=Default",
						x: "32",
						y: "84",
						width: "36",
						height: "20",
					},
					{
						id: "32:689",
						name: "Checked=On, State=Hover",
						x: "100",
						y: "84",
						width: "36",
						height: "20",
					},
					{
						id: "32:690",
						name: "Checked=On, State=Focus",
						x: "168",
						y: "84",
						width: "36",
						height: "20",
					},
					{
						id: "32:691",
						name: "Checked=On, State=Disabled",
						x: "236",
						y: "84",
						width: "36",
						height: "20",
					},
				],
			},
		],
	},
	{
		id: "210:2012",
		name: "08 · Data & feedback",
		width: "2600",
		height: "1108",
		items: [
			{
				id: "32:649",
				name: "Badge",
				x: 32.0,
				y: 128.0,
				items: [
					{
						id: "32:643",
						name: "Tone=Neutral",
						x: "32",
						y: "32",
						width: "54",
						height: "24",
					},
					{
						id: "32:644",
						name: "Tone=Success",
						x: "162",
						y: "32",
						width: "54",
						height: "24",
					},
					{
						id: "32:645",
						name: "Tone=Warning",
						x: "292",
						y: "32",
						width: "54",
						height: "24",
					},
					{
						id: "32:646",
						name: "Tone=Error",
						x: "422",
						y: "32",
						width: "54",
						height: "24",
					},
					{
						id: "32:647",
						name: "Tone=Info",
						x: "552",
						y: "32",
						width: "54",
						height: "24",
					},
					{
						id: "32:648",
						name: "Tone=Accent",
						x: "682",
						y: "32",
						width: "54",
						height: "24",
					},
				],
			},
			{
				id: "32:659",
				name: "Avatar",
				x: 892.0,
				y: 128.0,
				items: [
					{
						id: "32:656",
						name: "Size=Small",
						x: "32",
						y: "32",
						width: "24",
						height: "24",
					},
					{
						id: "32:657",
						name: "Size=Medium",
						x: "104",
						y: "32",
						width: "32",
						height: "32",
					},
					{
						id: "32:658",
						name: "Size=Large",
						x: "176",
						y: "32",
						width: "40",
						height: "40",
					},
				],
			},
			{
				id: "32:748",
				name: "Spinner",
				x: 1188.0,
				y: 128.0,
				items: [
					{
						id: "32:746",
						name: "Size=Small",
						x: "32",
						y: "32",
						width: "16",
						height: "16",
					},
					{
						id: "32:747",
						name: "Size=Medium",
						x: "88",
						y: "32",
						width: "24",
						height: "24",
					},
				],
			},
			{
				id: "32:758",
				name: "Surface",
				x: 1476.0,
				y: 128.0,
				items: [
					{
						id: "32:755",
						name: "Elevation=Flat",
						x: "32",
						y: "32",
						width: "320",
						height: "180",
					},
					{
						id: "32:756",
						name: "Elevation=Panel",
						x: "384",
						y: "32",
						width: "320",
						height: "180",
					},
					{
						id: "32:757",
						name: "Elevation=Overlay",
						x: "736",
						y: "32",
						width: "320",
						height: "180",
					},
				],
			},
			{
				id: "129:1352",
				name: "Progress / Credit ring",
				x: 32.0,
				y: 460.0,
				items: [
					{
						id: "129:1352",
						name: "Default",
						x: "0",
						y: "0",
						width: "16",
						height: "16",
					},
				],
			},
			{
				id: "129:1355",
				name: "Progress / Credit balance",
				x: 320.0,
				y: 460.0,
				items: [
					{
						id: "129:1355",
						name: "Default",
						x: "0",
						y: "0",
						width: "500",
						height: "6",
					},
				],
			},
			{
				id: "52:1090",
				name: "Product / Capability row",
				x: 868.0,
				y: 460.0,
				items: [
					{
						id: "52:1054",
						name: "State=Enabled",
						x: "24",
						y: "24",
						width: "1072",
						height: "104",
					},
					{
						id: "52:1067",
						name: "State=Available",
						x: "24",
						y: "152",
						width: "1072",
						height: "104",
					},
				],
			},
			{
				id: "52:1091",
				name: "Product / Version row",
				x: 32.0,
				y: 828.0,
				items: [
					{
						id: "52:1091",
						name: "Default",
						x: "0",
						y: "0",
						width: "1072",
						height: "104",
					},
				],
			},
			{
				id: "52:1109",
				name: "Product / Staff row",
				x: 1152.0,
				y: 828.0,
				items: [
					{
						id: "52:1109",
						name: "Default",
						x: "0",
						y: "0",
						width: "648",
						height: "80",
					},
				],
			},
			{
				id: "58:1060",
				name: "Product / Library item",
				x: 1848.0,
				y: 828.0,
				items: [
					{
						id: "58:1046",
						name: "State=Default",
						x: "24",
						y: "24",
						width: "352",
						height: "88",
					},
					{
						id: "58:1053",
						name: "State=Selected",
						x: "24",
						y: "136",
						width: "352",
						height: "88",
					},
				],
			},
		],
	},
];

function Specimen({ id, name }: { id: string; name: string }) {
	const props = Object.fromEntries(
		name.split(", ").map((part) => part.split("=")),
	);
	const state = props.State?.toLowerCase();
	if (["32:43", "32:152", "32:261", "32:370"].includes(id))
		return (
			<Button
				variant={
					id === "32:152"
						? "secondary"
						: id === "32:261"
							? "ghost"
							: id === "32:370"
								? "destructive"
								: "default"
				}
				size={props.Size as "Small" | "Medium"}
				state={state as "default"}
			>
				{id === "32:370" ? "Unpublish" : "Continue"}
			</Button>
		);
	if (id === "32:479")
		return (
			<IconButton
				label="Send message"
				size={props.Size as "Small" | "Medium"}
				state={state as "default"}
			/>
		);
	if (id === "108:1306") return <ProjectActions state={state as "default"} />;
	if (id === "32:532")
		return (
			<FormField
				label="Label"
				placeholder="Enter a value"
				state={state as "default"}
				defaultValue={state === "filled" ? "Customer support" : undefined}
			/>
		);
	if (id === "32:569")
		return (
			<Textarea
				label="Label"
				placeholder="Enter a value"
				state={state as "default"}
				defaultValue={state === "filled" ? "Customer support" : undefined}
			/>
		);
	if (id === "32:600")
		return (
			<SelectField
				state={state as "default"}
				defaultValue={state === "filled" ? "editor" : ""}
			/>
		);
	if (id === "51:1022") return <PasswordField />;
	if (id === "185:1606")
		return (
			<OtpField
				defaultValue={state === "empty" ? "" : "482691"}
				processing={state === "processing"}
			/>
		);
	if (id === "32:671")
		return (
			<Checkbox checked={props.Checked === "On"} state={state as "default"} />
		);
	if (id === "32:692")
		return (
			<Switch checked={props.Checked === "On"} state={state as "default"} />
		);
	if (id === "32:649")
		return <Badge tone={props.Tone?.toLowerCase() as "neutral"}>Status</Badge>;
	if (id === "32:659")
		return <Avatar size={props.Size?.toLowerCase() as "small"} />;
	if (id === "32:748")
		return <Spinner size={props.Size?.toLowerCase() as "small"} />;
	if (id === "32:758")
		return <Surface elevation={props.Elevation?.toLowerCase() as "flat"} />;
	if (id === "129:1352") return <CreditRing remaining={11} allocation={12} />;
	if (id === "129:1355")
		return <CreditBalance remaining={462} allocation={500} />;
	if (id === "52:1090")
		return (
			<CapabilityRow
				name="Service recommendations"
				description="Recommend the right service using approved company knowledge."
				state={state as "enabled"}
			/>
		);
	if (id === "52:1091")
		return (
			<VersionRow
				version="V4"
				title="Updated company branding"
				meta="Today, 11:15 · Rakib"
			/>
		);
	if (id === "52:1109")
		return (
			<StaffRow
				name="Rakib"
				email="rakib@whiteframe.agency"
				initials="RA"
				workspaceRole="Owner"
			/>
		);
	if (id === "58:1060")
		return (
			<LibraryItem
				name="Service recommendations"
				description="Used in 2 projects"
				selected={state === "selected"}
			/>
		);
	return null;
}

function ComparisonBoard({ index }: { index: number }) {
	const board = boards[index];
	if (!board) return null;
	const labelStyle: CSSProperties = {
		position: "absolute",
		color: "var(--foreground-muted)",
		fontSize: 14,
		lineHeight: "20px",
		fontWeight: 400,
		margin: 0,
	};
	return (
		<div
			data-ap-motion="reduced"
			style={{
				width: 2680,
				minWidth: 2680,
				height: Number(board.height) + 80,
				padding: 40,
				boxSizing: "border-box",
				background: "#f4f4f4",
			}}
		>
			<div
				data-figma-review-board={board.id}
				style={{
					width: Number(board.width),
					height: Number(board.height),
					position: "relative",
					background: "var(--card-background)",
					outline: "1px solid var(--border-default)",
				}}
			>
				<h1
					style={{
						...labelStyle,
						left: 32,
						top: 24,
						fontSize: 18,
						lineHeight: "22px",
						fontWeight: 590,
						color: "var(--foreground-default)",
					}}
				>
					{board.name}
				</h1>
				{board.items.map((group) => (
					<div key={group.id}>
						<p style={{ ...labelStyle, left: group.x, top: group.y - 28 }}>
							{group.name}
						</p>
						{group.items.map((item) => (
							<div
								key={item.id}
								data-figma-node={item.id}
								data-figma-width={item.width}
								data-figma-height={item.height}
								style={{
									position: "absolute",
									left: group.x + Number(item.x),
									top: group.y + Number(item.y),
								}}
							>
								<Specimen id={group.id} name={item.name} />
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export default {
	title: "Guides/Figma comparison/Controls and data",
	component: ComparisonBoard,
	tags: ["!autodocs"],
	parameters: {
		layout: "fullscreen",
		controls: { disable: true },
		docs: {
			description: {
				component:
					"Review-only canvases place the actual React components at the native Figma variant positions. These coordinates are library navigation fixtures, not product page layouts. Use each component's ordinary stories for responsive and interactive usage.",
			},
		},
	},
	globals: { theme: "light", motion: "reduced" },
} satisfies Meta<typeof ComparisonBoard>;
type Story = StoryObj<typeof ComparisonBoard>;
export const Actions: Story = {
	args: { index: 0 },
	parameters: { figmaComponentId: "210:1970" },
};
export const Forms: Story = {
	args: { index: 1 },
	parameters: { figmaComponentId: "210:1978" },
};
export const Data: Story = {
	args: { index: 2 },
	parameters: { figmaComponentId: "210:2012" },
};
