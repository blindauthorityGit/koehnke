export const homePageQuery = `
{
  "startPage": *[_type == "startPage"][0]{
    seo,
    heroTitle,
    heroSubtitle,

    heroButtons[]{
      _key,
      label,
      variant,
      linkType,
      ariaLabel,
      opensInNewTab,
      externalUrl,
      internalLink->{
        _id,_type,title,
        "slug": slug.current
      }
    },

    heroImage{..., asset->},

    "textImageSection": textImageSection{
      layout,
      title,
      body,
      image{..., asset->, alt, isDecorative, caption},
      buttons[]{
        label, variant, linkType, ariaLabel, opensInNewTab,
        internalLink->{_type,_id,title,"slug": slug.current},
        externalUrl
      }
    },

    teamOverviewTitle,
    teamOverviewSubtitle,

    gallery[]{
      _key,
      alt,
      isDecorative,
      caption,
      asset->{
        _id,
        url,
        metadata{ lqip }
      }
    }
  },

  "settings": *[_type == "settings"][0]{ businessName, address, contact, openingHours },

  "teamSection": *[_type == "teamSection"][0]{ title, subtitle, members[]->{_id,title,subtitle,teaser,image{...,asset->}} },

  "services": *[_type == "service" && defined(slug.current)]
    | order(order asc, title asc){
      _id, title, "slug": slug.current, teaser,
      heroImage{..., asset->},
      image{..., asset->}
    }
}
`;

export const serviceQuery = `
{
  "page": *[_type == "servicesPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      asset->
    },
    introTitle,
    introText,

    sections[]{
      _type,
      layout,
      title,
      body,

      image{
        ...,
        asset->,
        alt,
        isDecorative,
        caption
      },

      buttons[]{
        label,
        variant,
        linkType,
        internalTargetType,  // << NEU
        internalPath,        // << NEU
        ariaLabel,
        opensInNewTab,
        forceDownload,

        internalLink->{
          _type,
          "slug": slug.current
        },

        externalUrl,

        file->{
          title,
          file{
            asset->{url}
          }
        }
      }
    },

    seo
  },

  "services": *[_type == "service"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    teaser,
    heroImage{..., asset->},
    image{..., asset->}
  }
}
`;

export const singleServiceQuery = `
{
  // Einzelne Leistungsseite per Slug
  "service": *[_type == "service" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    order,

    // HERO BILD – gleiche Struktur wie in anderen Sektionen
    heroImage{
      ...,
      asset->,
      alt,
      isDecorative,
      caption
    },

    // Kurzbeschreibung (z. B. für Hero-Subline)
    teaser,

    // Intro als Text-/Bild-Sektion (kompatibel zu TextImageSection)
    introSection{
      _type,
      layout,
      title,
      body,

      image{
        ...,
        asset->,
        alt,
        isDecorative,
        caption
      },

      buttons[] {
        label,
        variant,
        linkType,
        ariaLabel,
        opensInNewTab,

        // interne Seite dereferenzieren
        internalLink->{
          _type,
          _id,
          title,
          "slug": slug.current
        },

        // externe URL
        externalUrl
      }
    },

    // Hauptinhalt: Richtext, Bilder, zusätzliche Text-/Bild-Sektionen
    body[] {
      ...,

      // Bilder im Fließtext – gleiche Struktur wie sonst
      _type == "image" => {
        ...,
        asset->,
        alt,
        isDecorative,
        caption
      },

      // weitere TextImageSections im Body
      _type == "textImageSection" => {
        _type,
        layout,
        title,
        body,

        image{
          ...,
          asset->,
          alt,
          isDecorative,
          caption
        },

        buttons[] {
          label,
          variant,
          linkType,
          ariaLabel,
          opensInNewTab,
          internalLink->{
            _type,
            _id,
            title,
            "slug": slug.current
          },
          externalUrl
        }
      }
    },

    // Verwandte Leistungen (z. B. für "Weitere Leistungen")
    relatedServices[]->{
      _id,
      title,
      "slug": slug.current,
      teaser,
      heroImage{
        ...,
        asset->,
        alt,
        isDecorative,
        caption
      }
    },

    // SEO Block
    seo{
      metaTitle,
      metaDescription,
      ogImage{
        ...,
        asset->,
        alt,
        isDecorative,
        caption
      }
    }
  },

  // Liste aller Leistungen (z. B. für Sidebar / Navigation / Footer)
  "services": *[_type == "service"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    teaser,
    heroImage{
      ...,
      asset->,
      alt,
      isDecorative,
      caption
    }
  }
}
`;

export const servicesForHomeQuery = `
  *[_type == "service" && defined(slug.current)]
    | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      teaser,
      image {
        ...,
        asset->
      }
    }
`;

// libs/queries.js
export const teamMembersQuery = /* groq */ `
  *[_type == "teamMember"] | order(title asc) {
    _id,
    title,
    subtitle,
    teaser,
    image{
      ...,
      alt,
      isDecorative,
      asset->
    }
  }
`;

// libs/queries.js
export const praxisPageQuery = /* groq */ `
{
  "page": *[_type == "praxisPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      alt,
      isDecorative,
      asset->
    },
    gallery[]{
      ...,
      alt,
      isDecorative,
      caption,
      asset->
    },
    imgTextSection{
      ...,
      image{
        ...,
        alt,
        isDecorative,
        asset->
      }
    },
    seo
  }
}
`;

// libs/queries.js
export const teamPageQuery = /* groq */ `
{
  "page": *[_type == "teamPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      alt,
      isDecorative,
      asset->
    },
    teamMembers[]->{
      _id,
      title,
      subtitle,
      teaser,
      image{
        ...,
        alt,
        isDecorative,
        asset->
      }
    },
    seo
  }
}
`;

// libs/queries.js
// libs/queries.js
export const patientServicesPageQuery = /* groq */ `
{
  "page": *[_type == "patientServicesPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      alt,
      isDecorative,
      asset->
    },

    cards[]{
      ...,
      image{..., alt, isDecorative, asset->},

      button{
        label,
        variant,
        linkType,
        internalTargetType,
        internalPath,
        opensInNewTab,
        ariaLabel,

        internalLink->{ _type, slug },

        file->{
          file{ asset-> }
        },

        externalUrl
      }
    },

    imgTextSection{
      ...,
      image{..., alt, isDecorative, caption, asset->},

      buttons[]{
        label,
        variant,
        linkType,
        internalTargetType,
        internalPath,
        opensInNewTab,
        ariaLabel,
        forceDownload,

        internalLink->{ _type, slug },

        file->{
          file{ asset-> }
        },

        externalUrl
      }
    },

    seo
  }
}
`;

// libs/queries.js
export const patientInfoPageQuery = /* groq */ `
{
  "page": *[_type == "patientInfoPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      alt,
      caption,
      isDecorative,
      asset->
    },
    introSection{
      ...,
      image{
        ...,
        alt,
        caption,
        isDecorative,
        asset->
      }
    },
    faqs[]{
      _key,
      question,
      answer
    },
    seo
  }
}
`;

// libs/queries.js
export const downloadsPageQuery = /* groq */ `
{
  "page": *[_type == "downloadsPage"][0]{
    _id,

    heroTitle,
    heroSubtitle,

    heroImage{
      ...,
      alt,
      caption,
      isDecorative,
      asset->
    },

    cards[]{
      _key,
      title,
      description,

      image{
        ...,
        alt,
        caption,
        isDecorative,
        asset->
      },

      buttons[]{
        _key,
        label,
        variant,
        linkType,
        internalTargetType,
        internalPath,
        ariaLabel,
        opensInNewTab,
        forceDownload,

        internalLink->{
          _type,
          slug{current}
        },

        file->{
          file{ asset-> }
        },

        externalUrl
      }
    },

    seo
  }
}
`;

export const singleJobQuery = `
{
  "job": *[_type == "jobPosting" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    teaser,

    image{
      ...,
      alt,
      isDecorative,
      caption,
      asset->
    },

    // Inhalte für Detailseite
    tasks,
    profile,
    benefits,

    seo
  }
}
`;

export const allJobsQuery = `
*[_type == "jobPosting" && defined(slug.current)] | order(_createdAt desc){
  _id,
  _type,
  title,
  "slug": slug.current,
  teaser,
  image{
    ...,
    alt,
    isDecorative,
    caption,
    asset->
  }
}
`;

// libs/queries.js

export const careerPageQuery = `
{
  "page": *[_type == "careerPage"][0]{
    _id,
    _type,
    heroTitle,
    heroSubtitle,
    heroImage{
      ...,
      alt,
      isDecorative,
      caption,
      asset->
    },
    seo,

    // Referenzen auf offene Stellen
    openPositions[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      teaser,
      image{
        ...,
        alt,
        isDecorative,
        caption,
        asset->
      }
    },

    // Zwei Textbereiche unten (wie im Layout)
    sectionLeft,
    sectionRight
  }
}
`;

export const jobSlugsQuery = `*[_type == "jobPosting" && defined(slug.current)].slug.current`;

export const contactPageQuery = `
*[_type == "contactPage"][0]{
  title,
  headline,
  intro,

  contact{
    practiceName,
    street,
    zip,
    city,
    phone,
    email
  },

  openingHours[]{
    days,
    time
  },

  cta{
    label,
    link
  },

  map{
    lat,
    lng,
    zoom
  }
}
`;
