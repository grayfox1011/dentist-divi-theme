# Perla – Dental Clinic theme for Divi 5

Thank you for your purchase! Setting up takes about five minutes: you install the theme and it
builds the demo site for you.

## Before you start

You need:

- A self-hosted WordPress site (not a WordPress.com free plan).
- The **Divi theme, version 5.4 or newer**, installed. Divi is sold separately by Elegant Themes
  and is not included in this download.

A new WordPress site is best. If your site already has content, back it up first.

## What is in the download

| File | What it is |
| --- | --- |
| `perla-child.zip` | The theme. Upload this file to WordPress exactly as it is: do not unzip it. |
| `Perla-Setup-Guide` | This guide. |
| `Perla-Pages-for-Divi-Library.json` | Optional. The page layouts as a Divi Library file (see step 4). |
| `Perla-Theme-Builder-Templates.json` | Optional. Header, footer and templates as a Theme Builder file (see step 4). |

## 1. Install the theme

1. Go to **Appearance → Themes → Add New Theme → Upload Theme**.
2. Choose `perla-child.zip`, click **Install Now**, then **Activate**.

That is all. On a new WordPress site the theme builds the demo site by itself, in a few seconds,
and then shows the **Perla Setup** screen with the list of what it created:

- 11 pages: Home, About, Services, one page for each of the six treatments, Blog and Contact
- the header and footer, the blog post template and the 404 page
- the main menu
- the colours, fonts and design variables of the theme
- three sample blog posts with placeholder images

Open your site: it now looks like the demo, scroll animations included.

### If your site already has content

The theme never changes a site that already has pages or posts of its own. After you activate it
you see the **Perla Setup** screen with one button: **Install the demo site**.

Only what is missing is added. A page that already exists at the same address (for example
`/about/`), your menu, your Theme Builder templates and your posts are left exactly as they are,
and the screen lists what was added and what was left alone.

You find the screen again at any time under **Appearance → Perla Setup**. **Run the set-up again**
re-creates anything you have deleted, without touching the rest.

### If something goes wrong

- **"The theme is missing the style.css stylesheet"**: WordPress received the wrong file. Upload
  `perla-child.zip` itself, not a folder and not a zip that contains it. Safari on a Mac unzips
  downloads automatically: in that case compress the `perla-child` folder again, or download the
  file with another browser.
- **"The parent theme is missing"**: install Divi first, then install Perla.
- **"Perla needs the Divi theme, version 5.4 or newer"**: update Divi, then open
  **Appearance → Perla Setup** and click the button.

## 2. Make it yours

### Clinic details, in one place

Open any page with the Divi builder and open the **Variable Manager** in the left bar. Change
these once and they update in the header, the footer and every page:

- Clinic Name, Phone Number, Email Address, Address, Opening Hours
- Phone Link (`tel:+1...`) and Email Link (`mailto:...`)
- Booking Page (where the "Book a visit" buttons go)

### Your logo

Go to **Divi → Theme Builder**, open the **Global Header**, click the Menu module and replace the
logo image. A transparent PNG about 120 px high works well (it is shown 40 px high).

### Colours and fonts

In the same Variable Manager you find every colour of the theme (Primary, Secondary, Heading,
Body, Dark Background, Soft Blue Background and more) and the corner radius, spacing and text
size settings. The two fonts are under **Divi → Theme Customizer → General Settings → Typography**.

Three ready-made palettes you can type in:

| Palette | Primary | Primary – Hover | Secondary | Dark Background | Soft Blue Background |
| --- | --- | --- | --- | --- | --- |
| Ocean (default) | `#1a66e8` | `#114db8` | `#12b5a5` | `#081632` | `#edf4ff` |
| Mint | `#0b7f70` | `#086257` | `#1a66e8` | `#06302b` | `#e8f7f4` |
| Lavender | `#6d4de0` | `#5136b5` | `#12b5a5` | `#1a1240` | `#f1edff` |

### Photos

The layouts use light placeholder images, so nothing has to be uploaded during set-up. Click any
image and replace it with your own photo. Recommended sizes:

| Where | Size |
| --- | --- |
| Hero, About, Story | 960 × 1040 px (portrait) |
| Treatment pages | 960 × 860 px |
| Team members | 640 × 760 px |
| Before / after | 960 × 720 px, both the same size |
| Review avatars | 120 × 120 px |

### Treatment pages

Each treatment has its own page under **Pages → Services**: General Dentistry, Cosmetic Dentistry,
Dental Implants, Teeth Whitening, Orthodontics and Emergency Care. Change the texts and the
"At a glance" facts on each one. Dental Implants also shows a price table: delete that section if
you do not publish prices.

Do you not offer a treatment? Move its page to the trash, then remove its card on the Home and
Services pages and its link in the footer.

### Contact form

Open the Contact page, click the form and add the email address that should receive requests.
The form uses Divi's built-in captcha; you can connect a spam protection service in the same
panel.

### Map

On the Contact page, click the map (a Code module) and replace `Springfield,+IL` in the address
with your own, using `+` instead of spaces, for example `10+Main+Street,+Boston`.

### Menu

The theme creates a menu with Home, About, Services, Blog and Contact. Change it in
**Appearance → Menus**.

## 3. Animations

Perla animates the pages while your visitors scroll:

- titles are revealed line by line;
- cards, list items and buttons appear one after another;
- large photos are unveiled from the bottom;
- on computers, the top section of each page shrinks into a rounded card as the page scrolls on;
- with a mouse wheel or a trackpad the page glides instead of jumping (smooth scrolling). Phones
  and tablets keep their own scrolling, which is already smooth.

None of this runs inside the Divi builder, so you always edit the finished page. Visitors who
have asked their device to reduce motion see the pages without animations and with normal
scrolling.

### Turn them off

Go to **Appearance → Perla Setup**. Under **Animations** there are two boxes:

- **Play the scroll animations** switches everything off when you untick it.
- **Smooth scrolling with the mouse wheel and the trackpad** switches off only the gliding and
  keeps the animations.

Click **Save**.

If a pop-up or a chat window from another plugin does not scroll properly with the mouse wheel,
switch the smooth scrolling off: some plugins do not expect it.

### Animate something you add

Every animation is a class name. Open the settings of a module, row or section in the builder, go
to the **Advanced** tab and open **Attributes**. Click **Add Attribute**, type `class` as the
attribute name and one of these names as its value:

| Class | Use it on | What it does |
| --- | --- | --- |
| `perla-reveal` | any module | Fades in while it rises. |
| `perla-stagger` | a row, a column or a group | Its items appear one after another. |
| `perla-split` | a Heading module | The title is revealed line by line. |
| `perla-image` | an Image module | The picture is unveiled from the bottom. |
| `perla-pop` | a row with a background | The panel grows to its full size as it scrolls into view. |
| `perla-hero` | the first section of a page | The section shrinks into a card while the page scrolls on. |

To remove an animation from a module, delete that attribute.

## 4. Optional: the layouts as Divi files

You do not need these files for a normal set-up. They are useful in two cases.

**To build more pages from the Perla layouts**, add them to your Divi Library:

1. Go to **Divi → Divi Library** and click **Import & Export**.
2. Open the **Import** tab, choose `Perla-Pages-for-Divi-Library.json` and click
   **Import Divi Builder Layouts**.
3. Create a page, click **Use Divi Builder**, then the **+** button at the top of the left bar →
   **Saved Layout** → **Your Saved Layouts**. Pick a "Perla –" layout and click
   **Use This Layout**.

**To add the Perla header and footer to a site that already had Theme Builder templates** (the
set-up leaves those alone):

1. Go to **Divi → Theme Builder** and click the **Portability** icon (two arrows) at the top right.
2. Open the **Import** tab and choose `Perla-Theme-Builder-Templates.json`. Leave
   **Override Existing Default Website Template** ticked to show the Perla header and footer on
   the whole site, then click **Import Divi Theme Builder Templates**.
3. Click **Save Changes**.

Templates you already had for blog posts or for the 404 page are kept as "Unassigned": delete
them, or assign them again if you prefer yours.

## Good to know

- **Sample content of WordPress.** "Hello world!" and "Sample Page" come with every new WordPress
  site. You can delete them.
- **Privacy policy and Terms.** The footer links to `/privacy-policy/` and `/terms/`. WordPress
  prepares a draft privacy policy for you under **Pages**: complete and publish it, and create a
  Terms page, or remove the two links in the Global Footer.
- **The header stays at the top while scrolling.** To turn this off, open the header section in
  the Theme Builder, type "sticky" in the settings search box and set the sticky position to
  *Do Not Stick*.
- **Blog cards** show your real posts. Add a featured image to each post for the best result.
- **Blog posts** do not repeat the featured image at the top. To show it, open the "All Posts"
  template in the Theme Builder and enable the image in the Post Title module.
- **Updating Divi** is safe: the layouts are standard Divi content, and newer Divi versions
  update older layouts automatically.
- **Updating Perla.** Upload the new `perla-child.zip` the same way and choose *Replace installed
  with uploaded*. Your pages stay exactly as you edited them. If you would rather have the new
  version of the demo pages, use **Appearance → Perla Setup → Restore the demo pages**: it replaces
  the changes you made to the pages Perla created, so use it before you start editing or on pages
  you are happy to redo.

## Need help?

Send a message through the shop where you bought the theme. Please include your Divi version and
a screenshot of what you see.

---

Divi is a trademark of Elegant Themes, Inc. This product is not affiliated with or endorsed by
Elegant Themes.
