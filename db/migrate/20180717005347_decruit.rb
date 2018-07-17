
NAMES = [
"Whirlpool Solutions",
"Pride Networks",
"Moth Corporation",
"Vortexecurity",
"Fortunetworks",
"Blizzart",
"Icecorps",
"Nightsearch",
"Griffinhut",
"Typhoonbank",
"Petal Microsystems",
"Whiteout Softwares",
"Whirlwind Productions",
"Moondustries",
"Glaciarts",
"Sunlightning",
"Griffindustries",
"Icestones",
"Cloudnite",
"Spiderfly",
"Imagination Softwares",
"Summit Records",
"Night Solutions",
"Grizzlimited",
"Cavologies",
"Monarctronics",
"Revelationetworks",
"Grizzlyscape",
"Beedleway",
"Purpledew",
"Imagination Softwares",
"Summit Records",
"Night Solutions",
"Grizzlimited",
"Cavologies",
"Monarctronics",
"Revelationetworks",
"Grizzlyscape",
"Beedleway",
"Purpledew",
"Boar Security",
"Oyster Productions",
"Brisk Navigations",
"Mysticorps",
"Gemedia",
"Aces",
"Zeusolutions",
"Cavetechs",
"Griffinmobile",
"Omegawood",
"Jungle Softwares",
"Sail Industries",
"Blossom Acoustics",
"Leopardworks",
"Bearings",
"Wooductions",
"Ghostronics",
"Blossomcloud",
"Grottopoint",
"Signair",
"River Navigations",
"Bluff Systems",
"Essence Corporation",
"Squidustries",
"Grasshoproductions",
"Signetworks",
"Oracleutions",
"Zeustechs",
"Riverdew",
"Bluemart",
"Hummingbird Arts",
"Storm Arts",
"Hummingbird Sports",
"Elitelligence",
"Fortunetworks",
"Firetronics",
"Gnomelectrics",
"Riddletime",
"Omegabooks",
"Coreland",
"Raptor Corporation",
"Purple Softwares",
"Specter Lighting",
"Spicurity",
"Wizardustries",
"Dreamedia",
"Apachicorp",
"Luckysearch",
"Grottotechs",
"Honeymobile",
"Wizard Arts",
"Crow Networks",
"Paragon Technologies",
"Apachicorp",
"Betarts",
"Fluxystems",
"Shadoworks",
"Gnomecloud",
"Quadpoly",
"Soulbank",
"Cliff Productions",
"Cruise Foods",
"Cliff Lighting",
"Pixelimited",
"Sawwares",
"Dynamico",
"Dwarfoods",
"Hogland",
"Cloudman",
"Karmabeat"
]

def doit
  pos = 0
  User.is_recruiter.each do |u|
    if u.first_name.start_with?("Recruiter-")
      u.first_name = u.first_name["Recruiter-".length, u.first_name.length]
      u.save
    end
  
    u.company.name = NAMES[pos]
    pos = pos + 1
  
    url = u.company.name.gsub("\s", "").downcase + ".com"
  
    puts u.company.name
    puts u.company.url

    u.company.url = url

    u.company.save
    
  end
end

class Decruit < ActiveRecord::Migration[5.1]
  def up
    doit
  end

  def down
    # nothing to see here
  end
end
