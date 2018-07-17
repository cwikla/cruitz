
NAMES = [
"Crystal Productions",
"Saturn Enterprises",
"Joy Intelligence",
"Signalimited",
"Greatechnologies",
"Diamontronics",
"Thorecords",
"Oakex",
"Nymphfly",
"Spiderpoly",
"Lucent Lighting",
"Apex Coms",
"Pumpkin Solutions",
"Felinetworks",
"Saturnetworks",
"Jupitelligence",
"Signalimited",
"Smileshadow",
"Rosebank",
"Joyaid",
"Alpha Enterprises",
"Pyramid Aviation",
"Cruise Softwares",
"Redustries",
"Seawares",
"Houndnavigations",
"Blossomotors",
"Sunmedia",
"Oysterpoint",
"Tigercloud",
"Oyster Enterprises",
"Stardust Sports",
"Lucky Technologies",
"Explority",
"Karmarts",
"Ironavigation",
"Saplimited",
"Rhinosun",
"Flowerfruit",
"Spiritbit",
"Butterfly Sports",
"Gold Electronics",
"Cube Records",
"Visionetworks",
"Delugation",
"Betarts",
"Mountelligence",
"Houndland",
"Mermaidshade",
"Cannongate",
"Silver Lining Networks",
"Aura Electronics",
"Clover Systems",
"Oakoms",
"Stormedia",
"Saplimited",
"Protonetworks",
"Shadecoms",
"Ironbank",
"Oystershade",
"Solstice Records",
"Revelation Navigations",
"Gold Productions",
"Cubrews",
"Nemotors",
"Asco",
"Honeytelligence",
"Primeex",
"Dwarfmart",
"Smarthouse",
"Iceberg Corporation",
"Sun Productions",
"Silver Lining Networks",
"Herbrews",
"Tidustries",
"Elecoms",
"High Tidustries",
"Webhead",
"Berrytechs",
"Wizardshadow",
"Thunder Electronics",
"Iceberg Navigations",
"Ogre Co.",
"Mazecurity",
"North Starporation",
"Phoenixolutions",
"Sailightning",
"Fairybite",
"Nimblewater",
"Spritetube",
"Cryptic Security",
"Midnight Coms",
"Moon Sports",
"Chiefoods",
"Valkyrecords",
"Summitechnologies",
"Betarts",
"Cavecoms",
"Arcanehive",
"Ridgeking",
"Question Brews",
"Gale Security",
"Web Microsystems",
"Soulightning",
"Padlockurity",
"Plutronics",
"Cavologies",
"Pinkpoint",
"Spikeware",
"Bluebit",
"Shrub",
"Neptune Intelligence",
"Jungle Lighting",
"Omegacoustics",
"Apachicorp",
"Owlimited",
"Hatchworks",
"Grizzlyways",
"Jetbridge",
"Boargold",
"Essence Industries",
"Apex Electronics",
"Cliff Electronics",
"Goldustries",
"Moonlightings",
"Alpite",
"Grizzlimited",
"Spiritmobile",
"Honeynite",
"Shadeworld",
"Blue ",
"Answer Systems",
"Nero Intelligence",
"Ironavigation",
"Spideradio",
"Phantasmedia",
"Buzzylectrics",
"Typhoonfruit",
"Joybeat",
"Moonway"
]

def doit
 pos = 0
 User.not_recruiter.each do |u|
   u.first_name = u.first_name || "Bob"
   u.last_name = u.last_name || "Smith"
   if u.first_name.start_with?("Seeker-")
     u.first_name = u.first_name["Seeker-".length, u.first_name.length]
     u.save
   end
 
   u.company.name = NAMES[pos]
   pos = pos + 1
 
   url = u.company.name.gsub("\s", "").downcase + ".com"
 
   puts u.company.name
   u.company.url = url
   u.company.save

 end
end

class Deseeker < ActiveRecord::Migration[5.1]
  def up
    doit
  end
  def down

    # nothing to see here
  end
end
