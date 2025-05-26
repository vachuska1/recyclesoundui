"use client"


import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { sendContactForm } from "@/app/actions"
import Map from "@/components/Map"

export default function Home() {
  const [language, setLanguage] = useState<"cs" | "en">("cs")
  const { toast } = useToast()

  const translations = {
    cs: {
      nav: {
        brand: "RECYCLESOUND",
        smartContainers: "Chytré kontejnery",
        mobileContainers: "Mobilní kontejnery",
        detectors: "Hlásiče",
      },
      hero: {
        title: "Udržitelná budoucnost díky modernímu vzdělávání o třídění a snižování množství odpadu",
      },
      smartContainers: {
        title: "Chytré kontejnery",
        subtitle: "Snižování nákladů, zvyšování efektivity a motivace k lepšímu třídění",
        features: [
          "Automatické vážení – váží přesné množství odpadu",
          "Chytré hlášení – samy si vyžádají vývoz, když jsou plné",
          "Transparentní evidence – eviduje odpad od konkrétních původců",
          "Spravedlivé platby – platíte jen za skutečně vyprodukovaný odpad",
          "Motivace k třídění – bonusové programy a odměny",
          "Zábavné vzdělávání – interaktivní hlásiče pro efektivní třídění",
        ],
        conclusion: "Chytré kontejnery – revoluční řešení odpadového hospodářství pro moderní obce a firmy",
        cta: "Zjistit více",
      },
      mobileContainers: {
        title: "Mobilní kontejnery",
        subtitle: "Maximální flexibilita v odpadovém hospodářství",
        features: [
          "Mobilita – umožňuje flexibilní a operativní umístění mobilních kontejnerů dle potřeby",
          "Umožňuje vážení – váží množství odevzdaného odpadu",
          "Umožňuje evidenci – eviduje odpad od konkrétních původců",
          "Vlastní svoz – umožňuje obcím a firmám svážet vlastní odpad dostupnými prostředky, nezávisle na svozových společnostech",
          "Motivace k třídění – umožňuje zavádění motivačních bonusových programů a odměn za správné třídění",
          "Zábavné vzdělávání – vestavěné interaktivní hlásiče učí občany třídit efektivně a s úsměvem",
        ],
        conclusion: "Mobilní kontejnery – flexibilní řešení odpadového hospodářství pro moderní obce a firmy",
        cta: "Zjistit více",
      },
      detectors: {
        title: "Hlásiče",
        subtitle: "Moderní osvěta s umístěním designových hlásičů na veřejné prostranství, skrytě i do kontejnerů na tříděný odpad",
        features: [
          "Mobilita – umožňuje flexibilní a operativní umístění hlásičů dle potřeby",
          "Databáze nahrávek – široká škála vlastních veselých vzdělávacích informací v hlasech známých osobností",
          "Nezávislé napájení – vlastní baterie, solární napájení, 230 V",
          "Praktičnost – umožňuje obcím a firmám cílit komunikované informace a jejich obsah dle aktuálních potřeb",
          "Rychlé nahrávání – hlásiče umožňují změnu nahrávek ve velmi krátkém čase",
          "Bezpečné zařízení – hlásiče jsou navrženy pro vnitřní i venkovní použití (IP63)",
        ],
        conclusion: "Hlásiče jsou nástrojem pro operativní komunikaci informací, instrukcí a vzdělávání",
        cta: "Zjistit více",
      },
      contact: {
        title: "Kontakt",
        name: "Jméno",
        email: "E-mail",
        phone: "Telefon",
        message: "Zpráva",
        consent: "Souhlasím se zpracováním osobních údajů",
        send: "Odeslat",
        contactUs: "KONTAKTUJTE NÁS",
        success: "Děkujeme za vaši zprávu. Brzy se vám ozveme.",
        error: "Při odesílání zprávy došlo k chybě. Zkuste to prosím znovu.",
      },
    },
    en: {
      nav: {
        brand: "RECYCLESOUND",
        smartContainers: "Smart containers",
        mobileContainers: "Mobile containers",
        detectors: "Alarms",
      },
      hero: {
        title: "Sustainable future thanks to modern education about sorting and reducing the amount of waste",
      },
      smartContainers: {
        title: "Smart containers",
        subtitle: "Reducing costs, increasing efficiency and motivating for better sorting",
        features: [
          "Automatic weighing – weighs the exact amount of waste",
          "Smart reporting – they request export themselves when they are full",
          "Transparent records – records waste from specific producers",
          "Fair payments – you only pay for the waste actually produced",
          "Motivation for sorting – bonus programs and rewards",
          "Entertaining education – interactive alarms for effective sorting",
        ],
        conclusion:
          "Smart containers – revolutionary waste management solutions for modern municipalities and companies",
        cta: "Learn more",
      },
      mobileContainers: {
        title: "Mobile containers",
        subtitle: "Maximum flexibility in waste management",
        features: [
          "Mobility – enables flexible and operational placement of mobile containers as needed",
          "Enables weighing – weighs the amount of waste handed over",
          "Enables registration – registers waste from specific originators",
          "Own collection – enables municipalities and companies to collect their own waste using available means, independently of collection companies",
          "Motivation for sorting – enables the introduction of incentive bonus programs and rewards for correct sorting",
          "Entertaining education – built-in interactive alarms teach citizens how to sort effectively and with a smile",
        ],
        conclusion: "Mobile containers – flexible waste management solutions for modern municipalities and companies",
        cta: "Learn more",
      },
      detectors: {
        title: "Alarms",
        subtitle: "Modern awareness with the placement of designer detectors in public areas, hidden in containers for sorted waste",
        features: [
          "Mobility – allows flexible and operational placement of the alarms, as needed",
          "Recording database – a wide range of own cheerful educational information in the voices of well-known personalities",
          "Independent power supply – own battery, solar power, 230 V",
          "Practicality – allows municipalities and companies to target the communicated information and its content according to current needs",
          "Fast recording – alarms allow changing recordings in a very short time",
          "Safe device – alarms are designed for indoor and outdoor use (IP63)",
        ],
        conclusion: "Alarms are a tool for operational communication of information, instruction and education",
        cta: "Learn more",
      },
      contact: {
        title: "Contact",
        name: "Name",
        email: "E-mail",
        phone: "Phone",
        message: "Message",
        consent: "I agree to the processing of personal data",
        send: "Send",
        contactUs: "CONTACT US",
        success: "Thank you for your message. We will get back to you soon.",
        error: "There was an error sending your message. Please try again.",
      },
    },
  }

  const t = translations[language]

  const [activeSlide, setActiveSlide] = useState({
    smartContainers: 0,
    mobileContainers: 0,
    detectors: 0,
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  })

  const handleSlideChange = (
    section: "smartContainers" | "mobileContainers" | "detectors",
    direction: "prev" | "next",
  ) => {
    setActiveSlide((prev) => {
      const maxSlides = 
        section === "smartContainers" ? 5 : 
        section === "detectors" ? 3 : 2;
      let newIndex = prev[section]

      if (direction === "next") {
        newIndex = (newIndex + 1) % maxSlides
      } else {
        newIndex = (newIndex - 1 + maxSlides) % maxSlides
      }

      return { ...prev, [section]: newIndex }
    })
  }

  const smartContainerImages = [
    "/smart/bio.webp",
    "/smart/papir.webp",
    "/smart/plast.webp",
    "/smart/sklo.webp",
    "/smart/smiseny.webp",
    // ... další 3 fotky
  ]

  const mobileContainerImages = [
    "/mobil/Mobil1.jpg",
    "/mobil/Mobil2.jpg",
  ]

  const detectorImages = [
    "/detector/Hlasic2.png",
    "/detector/Hlasic3.png",
    "/detector/Hlasic1.png",
  ]


  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

const handleAudioToggle = (url: string) => {
  // Pokud už hraje tento soubor, pauzneme
  if (currentAudio?.src.endsWith(url)) {
    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }
    return;
  }

  // Jinak zastavíme aktuální a spustíme nový
  if (currentAudio) {
    currentAudio.pause();
  }

  const newAudio = new Audio(url);
  newAudio.play();
  setCurrentAudio(newAudio);

  newAudio.onended = () => {
    setCurrentAudio(null);
  };
};




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.consent) {
      toast({
        title: language === "cs" ? "Chyba" : "Error",
        description:
          language === "cs"
            ? "Prosím, potvrďte souhlas se zpracováním osobních údajů"
            : "Please confirm your consent to process personal data",
        variant: "destructive",
      })
      return
    }

    // Create email body
    const emailBody = `
      Jméno: ${formData.name}
      Email: ${formData.email}
      Telefon: ${formData.phone}
      Zpráva: ${formData.message}
    `

    // Create mailto link
    const mailtoLink = `mailto:vachuska@ekostat.cz?subject=Nová zpráva z webu RecycleSound&body=${encodeURIComponent(emailBody)}`
    
    // Open default email client
    window.location.href = mailtoLink
    
    // Show success message
    toast({
      title: language === "cs" ? "Úspěch" : "Success",
      description: language === "cs" 
        ? "Nyní vás přesměrujeme do vašeho emailového klienta"
        : "You will now be redirected to your email client",
    })
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] bg-white shadow-md rounded-lg z-50 py-4 px-6">
        <div className="flex justify-between items-center">
          <a href="#" className="text-[#20b2aa] font-bold text-xl">
            {t.nav.brand}
          </a>
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("smart-containers")}
              className="text-gray-700 hover:text-[#20b2aa] transition-colors"
            >
              {t.nav.smartContainers}
            </button>
            <button
              onClick={() => scrollToSection("detectors")}
              className="text-gray-700 hover:text-[#20b2aa] transition-colors"
            >
              {t.nav.detectors}
            </button>
            <button
              onClick={() => scrollToSection("mobile-containers")}
              className="text-gray-700 hover:text-[#20b2aa] transition-colors"
            >
              {t.nav.mobileContainers}
            </button>
            <Button
              onClick={() => setLanguage(language === "cs" ? "en" : "cs")}
              className="bg-[#20b2aa] hover:bg-[#48d1cc] text-white"
            >
              {language === "cs" ? "EN" : "CS"}
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="default"
              size="sm"
              onClick={() => setLanguage(language === "cs" ? "en" : "cs")}
              className="bg-[#20b2aa] hover:bg-[#48d1cc] text-white"
            >
              {language === "cs" ? "EN" : "CS"}
            </Button>
          </div>
        </div>
      </nav>

{/* Hero Section */}
<section className="pt-32 pb-16 px-4 sm:px-6">
  <div className="mx-auto w-full md:w-3/4 lg:w-3/4 xl:w-3/4 2xl:w-3/4"> {/* 75% width na desktopu */}
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8">
      {t.hero.title}
    </h1>
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
      <Image
        src="/Animation/Animation.png"
        alt="Recycling Hero Image"
        fill
        className="object-cover"
        priority
        quality={100}
        sizes="(max-width: 768px) 100vw, 75vw"
      />
    </div>
  </div>
</section>
      {/* Smart Containers Section */}
      <section id="smart-containers" className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#20b2aa] mb-2">{t.smartContainers.title}</h2>
          <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-8">{t.smartContainers.subtitle}</h3>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-white shadow-md">
              <div className="absolute inset-0 flex items-center justify-center">
              <Image
  src={smartContainerImages[activeSlide.smartContainers]}
  alt="Smart Container"
  fill
  className="object-contain"
/>
              </div>
              <div className="absolute inset-0 flex items-center">
                <button
                  onClick={() => handleSlideChange("smartContainers", "prev")}
                  className="absolute left-2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-[#20b2aa]" />
                </button>
                <button
                  onClick={() => handleSlideChange("smartContainers", "next")}
                  className="absolute right-2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-[#20b2aa]" />
                </button>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${activeSlide.smartContainers === index ? "bg-[#20b2aa]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <ul className="space-y-3">
                {t.smartContainers.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#40e0d0] flex items-center justify-center mt-0.5">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-gray-700 font-medium">{t.smartContainers.conclusion}</p>

              <Button className="mt-6 bg-[#20b2aa] hover:bg-[#48d1cc]" onClick={() => scrollToSection("contact")}>
                {t.smartContainers.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

{/* Detectors Section */}
<section id="detectors" className="py-16 px-4 md:px-8 lg:px-16">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-[#20b2aa] mb-2">{t.detectors.title}</h2>
    <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-8">{t.detectors.subtitle}</h3>

    <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-stretch"> {/* Změna na items-stretch */}
      {/* Obrázek */}
      <div className="relative w-full aspect-square md:aspect-[4/3] order-1 md:order-2"> {/* Přidán aspect ratio */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={detectorImages[activeSlide.detectors]}
            alt="Detectors"
            fill
            className="object-contain" 
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        {/* Audio tlačítka - nyní v horní části */}
<div className="absolute top-4 left-0 right-0 flex justify-center gap-4 z-20">
  {[1, 2, 3].map((num) => (
    <button
      key={num}
      onClick={() => handleAudioToggle(`/audio/sample${num}.mp3`)}
      className={`bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 transition-all
                 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center
                 ${currentAudio?.src.endsWith(`sample${num}.mp3`) && !currentAudio?.paused 
                   ? 'ring-2 ring-[#20b2aa] animate-pulse' 
                   : ''}`}
      aria-label={`Přehrát ukázku ${num}`}
    >
      <div className="relative">
        {currentAudio?.src.endsWith(`sample${num}.mp3`) && !currentAudio?.paused ? (
          <>
            <svg
              className="w-12 h-12 md:w-12 md:h-12 text-[#20b2aa]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700">
              ..........
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-12 h-12 md:w-12 md:h-12 text-[#20b2aa]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-small text-gray-400">
              Audio {num}
            </span>
          </>
        )}
      </div>
    </button>
  ))}
</div>


        {/* Navigační tlačítka */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button
            onClick={() => handleSlideChange("detectors", "prev")}
            className="bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-20"
          >
            <ChevronLeft className="h-6 w-6 text-[#20b2aa]" />
          </button>
          <button
            onClick={() => handleSlideChange("detectors", "next")}
            className="bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-20"
          >
            <ChevronRight className="h-6 w-6 text-[#20b2aa]" />
          </button>
        </div>

        {/* Indikátory */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20">
          {detectorImages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                activeSlide.detectors === index ? "bg-[#20b2aa]" : "bg-gray-300"
              }`}
              onClick={() => setActiveSlide(prev => ({
                ...prev,
                detectors: index
              }))}
            />
          ))}
        </div>
      </div>

      {/* Textový obsah */}
      <div className="order-2 md:order-1 flex flex-col justify-center"> {/* Přidáno zarovnání */}
        <ul className="space-y-3">
          {t.detectors.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#40e0d0] flex items-center justify-center mt-0.5">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <span className="ml-3 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-gray-700 font-medium">{t.detectors.conclusion}</p>
        
        <div className="mt-6">
          <Button className="bg-[#20b2aa] hover:bg-[#48d1cc]" onClick={() => scrollToSection("contact")}>
            {t.detectors.cta}
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Mobile Containers Section */}
<section id="mobile-containers" className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-[#20b2aa] mb-2">{t.mobileContainers.title}</h2>
    <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-8">{t.mobileContainers.subtitle}</h3>

    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Obrázek - nyní na levé straně */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-white shadow-md order-1 md:order-1">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={mobileContainerImages[activeSlide.mobileContainers]}
            alt="Mobil Container"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 flex items-center">
          <button
            onClick={() => handleSlideChange("mobileContainers", "prev")}
            className="absolute left-2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-[#20b2aa]" />
          </button>
          <button
            onClick={() => handleSlideChange("mobileContainers", "next")}
            className="absolute right-2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-[#20b2aa]" />
          </button>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${activeSlide.mobileContainers === index ? "bg-[#20b2aa]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Textový obsah - nyní na pravé straně */}
      <div className="order-2 md:order-2">
        <ul className="space-y-3">
          {t.mobileContainers.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#48d1cc] flex items-center justify-center mt-0.5">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <span className="ml-3 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-gray-700 font-medium">{t.mobileContainers.conclusion}</p>

        <Button className="mt-6 bg-[#20b2aa] hover:bg-[#48d1cc]" onClick={() => scrollToSection("contact")}>
          {t.mobileContainers.cta}
        </Button>
      </div>
    </div>
  </div>
</section>



      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#20b2aa] mb-8 text-center">{t.contact.title}</h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{t.contact.contactUs}</h3>

              <form 
                action="mailto:vachuska@ekostat.cz" 
                method="post" 
                encType="text/plain"
                className="space-y-4"
                onSubmit={(e) => {
                  if (!formData.consent) {
                    e.preventDefault();
                    toast({
                      title: language === "cs" ? "Chyba" : "Error",
                      description: language === "cs"
                        ? "Prosím, potvrďte souhlas se zpracováním osobních údajů"
                        : "Please confirm your consent to process personal data",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div>
                  <Label htmlFor="name">{t.contact.name}</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t.contact.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t.contact.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t.contact.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="consent" checked={formData.consent} onCheckedChange={handleCheckboxChange} />
                  <Label htmlFor="consent" className="text-sm">
                    {t.contact.consent}
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-[#20b2aa] hover:bg-[#48d1cc]">
                  <Send className="h-4 w-4 mr-2" />
                  {t.contact.send}
                </Button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Ing. Václav Vachuška, PhD.</h3>
                </div>

                <div>
                  <p className="font-medium">602 305 209</p>
                </div>

                <div>
                  <p className="font-medium">vachuska@ekostat.cz</p>
                </div>

                <div>
                  <p className="font-medium">Mayerova 1097, 34101 Horažďovice</p>
                </div>

                <div className="pt-4">
                  <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                  <Map />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#20b2aa] text-white py-8 px-4 md:px-8 lg:px-16">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <p className="font-bold text-xl">RECYCLESOUND</p>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button onClick={() => scrollToSection("smart-containers")} className="hover:underline">
          {t.nav.smartContainers}
        </button>
        <button onClick={() => scrollToSection("detectors")} className="hover:underline">
          {t.nav.detectors}
        </button>
        <button onClick={() => scrollToSection("mobile-containers")} className="hover:underline">
          {t.nav.mobileContainers}
        </button>
      </div>
    </div>

    <div className="mt-6 text-center">
      <p>
        &copy; {new Date().getFullYear()} RECYCLESOUND.{" "}
        {language === "cs" ? "Všechna práva vyhrazena." : "All rights reserved."}
      </p>
    </div>
  </div>
</footer>

    </main>
  )
}

