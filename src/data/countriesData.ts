// Comprehensive country data for Random Address Generator (200+ countries)

export interface CityData { city: string; state: string; lat: number; lng: number; }
export interface CountryData {
  flag: string; code: string; phoneFormat: string; timezone: string; currency: string;
  streets: string[]; cities: CityData[];
  format: (a: any) => string;
  zip: () => string;
}

function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChar() { return String.fromCharCode(65 + randNum(0, 25)); }

// Generic streets for countries without specific data
const genericStreets = ["Main Street", "Central Avenue", "Park Road", "Market Street", "Station Road", "High Street", "Church Street", "School Road", "Hospital Road", "Government Road"];

// Helper to create a standard country entry
function c(
  flag: string, code: string, phone: string, tz: string, cur: string,
  streets: string[], cities: CityData[],
  fmt: (a: any) => string, zip: () => string
): CountryData {
  return { flag, code, phoneFormat: phone, timezone: tz, currency: cur, streets, cities, format: fmt, zip };
}

const stdFmt = (country: string) => (a: any) => `${a.num} ${a.street}\n${a.city}${a.state ? ", " + a.state : ""} ${a.zip}\n${country}`;
const euFmt = (country: string) => (a: any) => `${a.street} ${a.num}\n${a.zip} ${a.city}\n${country}`;
const zip5 = () => String(randNum(10000, 99999));
const zip6 = () => String(randNum(100000, 999999));
const zip4 = () => String(randNum(1000, 9999));

export const countriesData: Record<string, CountryData> = {
  // ──────── NORTH AMERICA ────────
  "United States": c("🇺🇸", "+1", "(###) ###-####", "EST/CST/PST", "USD ($)",
    ["Main St","Oak Ave","Elm St","Maple Dr","Pine Rd","Cedar Ln","Broadway","5th Avenue","Park Ave","Washington Blvd","Sunset Dr","Lake View Rd","Highland Ave","Forest Ln","Valley Dr","River Rd","Mountain View Dr","Spring St","Ocean Blvd","Heritage Way"],
    [
      { city: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
      { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
      { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
      { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
      { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
      { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
      { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
      { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
      { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
      { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
      { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
      { city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nUnited States`,
    () => String(randNum(10000, 99999))
  ),
  "Canada": c("🇨🇦", "+1", "(###) ###-####", "EST/CST/PST", "CAD ($)",
    ["Maple Street","Bay Street","Yonge Street","King Street","Queen Street","Bloor Street","Granville Street","Jasper Avenue","Portage Avenue","Robson Street"],
    [
      { city: "Toronto", state: "ON", lat: 43.6532, lng: -79.3832 },
      { city: "Vancouver", state: "BC", lat: 49.2827, lng: -123.1207 },
      { city: "Montreal", state: "QC", lat: 45.5017, lng: -73.5673 },
      { city: "Calgary", state: "AB", lat: 51.0447, lng: -114.0719 },
      { city: "Ottawa", state: "ON", lat: 45.4215, lng: -75.6972 },
      { city: "Edmonton", state: "AB", lat: 53.5461, lng: -113.4938 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nCanada`,
    () => `${randChar()}${randNum(1,9)}${randChar()} ${randNum(1,9)}${randChar()}${randNum(1,9)}`
  ),
  "Mexico": c("🇲🇽", "+52", "## #### ####", "CST", "MXN ($)",
    ["Calle Reforma","Avenida Juárez","Calle Hidalgo","Avenida Insurgentes","Calle Madero","Boulevard Díaz Ordaz","Calle Morelos","Avenida Universidad"],
    [
      { city: "Mexico City", state: "CDMX", lat: 19.4326, lng: -99.1332 },
      { city: "Guadalajara", state: "JAL", lat: 20.6597, lng: -103.3496 },
      { city: "Monterrey", state: "NL", lat: 25.6866, lng: -100.3161 },
      { city: "Cancún", state: "QR", lat: 21.1619, lng: -86.8515 },
      { city: "Puebla", state: "PUE", lat: 19.0414, lng: -98.2063 },
    ],
    stdFmt("Mexico"), zip5
  ),
  "Cuba": c("🇨🇺", "+53", "## ######", "CST", "CUP (₱)",
    ["Calle Obispo","Malecón","Calle San Rafael","Avenida de los Presidentes","Calle 23"],
    [{ city: "Havana", state: "", lat: 23.1136, lng: -82.3666 }, { city: "Santiago de Cuba", state: "", lat: 20.0247, lng: -75.8219 }],
    stdFmt("Cuba"), zip5
  ),
  "Jamaica": c("🇯🇲", "+1-876", "###-####", "EST", "JMD ($)",
    ["King Street","Hope Road","Half Way Tree Road","Constant Spring Road"],
    [{ city: "Kingston", state: "", lat: 18.0179, lng: -76.8099 }, { city: "Montego Bay", state: "", lat: 18.4762, lng: -77.8939 }],
    stdFmt("Jamaica"), () => String(randNum(1, 99))
  ),
  "Costa Rica": c("🇨🇷", "+506", "####-####", "CST", "CRC (₡)",
    ["Avenida Central","Calle Blancos","Paseo Colón","Avenida Segunda"],
    [{ city: "San José", state: "", lat: 9.9281, lng: -84.0907 }, { city: "Alajuela", state: "", lat: 10.0162, lng: -84.2115 }],
    stdFmt("Costa Rica"), zip5
  ),
  "Panama": c("🇵🇦", "+507", "####-####", "EST", "PAB (B/.)",
    ["Calle 50","Vía España","Avenida Balboa","Calle Uruguay"],
    [{ city: "Panama City", state: "", lat: 8.9824, lng: -79.5199 }, { city: "Colón", state: "", lat: 9.3547, lng: -79.9015 }],
    stdFmt("Panama"), () => String(randNum(1000, 9999))
  ),
  "Guatemala": c("🇬🇹", "+502", "####-####", "CST", "GTQ (Q)",
    ["6a Avenida","Calle Real","Avenida Reforma","Boulevard Liberación"],
    [{ city: "Guatemala City", state: "", lat: 14.6349, lng: -90.5069 }, { city: "Antigua", state: "", lat: 14.5586, lng: -90.7295 }],
    stdFmt("Guatemala"), zip5
  ),
  "Honduras": c("🇭🇳", "+504", "####-####", "CST", "HNL (L)",
    ["Boulevard Morazán","Calle Real","Avenida La Paz"],
    [{ city: "Tegucigalpa", state: "", lat: 14.0723, lng: -87.1921 }, { city: "San Pedro Sula", state: "", lat: 15.5000, lng: -88.0333 }],
    stdFmt("Honduras"), zip5
  ),
  "Dominican Republic": c("🇩🇴", "+1-809", "###-####", "AST", "DOP (RD$)",
    ["Calle El Conde","Avenida Winston Churchill","Calle Duarte","Malecón"],
    [{ city: "Santo Domingo", state: "", lat: 18.4861, lng: -69.9312 }, { city: "Santiago", state: "", lat: 19.4517, lng: -70.6970 }],
    stdFmt("Dominican Republic"), zip5
  ),
  "Trinidad and Tobago": c("🇹🇹", "+1-868", "###-####", "AST", "TTD ($)",
    ["Frederick Street","Independence Square","Ariapita Avenue"],
    [{ city: "Port of Spain", state: "", lat: 10.6596, lng: -61.5086 }],
    stdFmt("Trinidad and Tobago"), () => String(randNum(100000, 999999))
  ),
  "Haiti": c("🇭🇹", "+509", "## ## ####", "EST", "HTG (G)",
    ["Rue Capois","Avenue Jean-Jacques Dessalines","Rue du Peuple"],
    [{ city: "Port-au-Prince", state: "", lat: 18.5944, lng: -72.3074 }],
    stdFmt("Haiti"), () => String(randNum(1000, 9999))
  ),
  "El Salvador": c("🇸🇻", "+503", "####-####", "CST", "USD ($)",
    ["Boulevard de los Héroes","Calle Arce","Alameda Roosevelt"],
    [{ city: "San Salvador", state: "", lat: 13.6929, lng: -89.2182 }],
    stdFmt("El Salvador"), () => String(randNum(1000, 9999))
  ),
  "Nicaragua": c("🇳🇮", "+505", "####-####", "CST", "NIO (C$)",
    ["Calle Central","Avenida Bolívar","Carretera Masaya"],
    [{ city: "Managua", state: "", lat: 12.1150, lng: -86.2362 }],
    stdFmt("Nicaragua"), zip5
  ),

  // ──────── SOUTH AMERICA ────────
  "Brazil": c("🇧🇷", "+55", "(##) 9####-####", "BRT", "BRL (R$)",
    ["Rua Augusta","Avenida Paulista","Rua Oscar Freire","Rua da Consolação","Avenida Brasil","Rua das Flores","Avenida Atlântica","Rua XV de Novembro"],
    [
      { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333 },
      { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 },
      { city: "Brasília", state: "DF", lat: -15.7975, lng: -47.8919 },
      { city: "Salvador", state: "BA", lat: -12.9714, lng: -38.5124 },
      { city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733 },
    ],
    (a) => `${a.street}, ${a.num}\n${a.city} - ${a.state}\n${a.zip}\nBrazil`,
    () => `${randNum(10000,99999)}-${randNum(100,999)}`
  ),
  "Argentina": c("🇦🇷", "+54", "11 ####-####", "ART", "ARS ($)",
    ["Avenida 9 de Julio","Calle Florida","Avenida Corrientes","Calle Rivadavia","Calle San Martín","Avenida de Mayo"],
    [
      { city: "Buenos Aires", state: "", lat: -34.6037, lng: -58.3816 },
      { city: "Córdoba", state: "", lat: -31.4201, lng: -64.1888 },
      { city: "Rosario", state: "", lat: -32.9468, lng: -60.6393 },
      { city: "Mendoza", state: "", lat: -32.8895, lng: -68.8458 },
    ],
    (a) => `${a.street} ${a.num}\n${a.zip} ${a.city}\nArgentina`,
    () => `${randChar()}${randNum(1000, 9999)}${randChar()}${randChar()}${randChar()}`
  ),
  "Colombia": c("🇨🇴", "+57", "3## ### ####", "COT", "COP ($)",
    ["Carrera 7","Calle 72","Avenida El Dorado","Carrera 15","Calle 100","Avenida Caracas"],
    [
      { city: "Bogotá", state: "", lat: 4.7110, lng: -74.0721 },
      { city: "Medellín", state: "", lat: 6.2442, lng: -75.5812 },
      { city: "Cali", state: "", lat: 3.4516, lng: -76.5320 },
      { city: "Cartagena", state: "", lat: 10.3910, lng: -75.5144 },
    ],
    stdFmt("Colombia"), () => String(randNum(100000, 999999))
  ),
  "Chile": c("🇨🇱", "+56", "9 #### ####", "CLT", "CLP ($)",
    ["Avenida Libertador","Calle Huérfanos","Avenida Providencia","Calle Agustinas","Paseo Ahumada"],
    [
      { city: "Santiago", state: "", lat: -33.4489, lng: -70.6693 },
      { city: "Valparaíso", state: "", lat: -33.0472, lng: -71.6127 },
      { city: "Concepción", state: "", lat: -36.8270, lng: -73.0503 },
    ],
    stdFmt("Chile"), () => String(randNum(1000000, 9999999))
  ),
  "Peru": c("🇵🇪", "+51", "9## ### ###", "PET", "PEN (S/.)",
    ["Avenida Arequipa","Jirón de la Unión","Avenida Larco","Calle Lima","Avenida Javier Prado"],
    [
      { city: "Lima", state: "", lat: -12.0464, lng: -77.0428 },
      { city: "Cusco", state: "", lat: -13.5320, lng: -71.9675 },
      { city: "Arequipa", state: "", lat: -16.4090, lng: -71.5375 },
    ],
    stdFmt("Peru"), zip5
  ),
  "Venezuela": c("🇻🇪", "+58", "04## ### ####", "VET", "VES (Bs.)",
    ["Avenida Bolívar","Calle Real","Avenida Urdaneta","Boulevard Sabana Grande"],
    [
      { city: "Caracas", state: "", lat: 10.4806, lng: -66.9036 },
      { city: "Maracaibo", state: "", lat: 10.6544, lng: -71.6406 },
    ],
    stdFmt("Venezuela"), zip4
  ),
  "Ecuador": c("🇪🇨", "+593", "09# ### ####", "ECT", "USD ($)",
    ["Avenida Amazonas","Calle García Moreno","Malecón 2000","Avenida 9 de Octubre"],
    [
      { city: "Quito", state: "", lat: -0.1807, lng: -78.4678 },
      { city: "Guayaquil", state: "", lat: -2.1710, lng: -79.9224 },
    ],
    stdFmt("Ecuador"), () => String(randNum(100000, 999999))
  ),
  "Bolivia": c("🇧🇴", "+591", "7# ### ###", "BOT", "BOB (Bs.)",
    ["Calle Comercio","Avenida Camacho","Calle Jaén","Avenida 6 de Agosto"],
    [{ city: "La Paz", state: "", lat: -16.4897, lng: -68.1193 }, { city: "Santa Cruz", state: "", lat: -17.7834, lng: -63.1821 }],
    stdFmt("Bolivia"), zip4
  ),
  "Paraguay": c("🇵🇾", "+595", "09## ### ###", "PYT", "PYG (₲)",
    ["Calle Palma","Avenida Mariscal López","Calle Estrella"],
    [{ city: "Asunción", state: "", lat: -25.2637, lng: -57.5759 }],
    stdFmt("Paraguay"), zip4
  ),
  "Uruguay": c("🇺🇾", "+598", "09# ### ###", "UYT", "UYU ($U)",
    ["Avenida 18 de Julio","Calle Sarandí","Rambla Sur"],
    [{ city: "Montevideo", state: "", lat: -34.9011, lng: -56.1645 }, { city: "Punta del Este", state: "", lat: -34.9667, lng: -54.9500 }],
    stdFmt("Uruguay"), zip5
  ),
  "Suriname": c("🇸🇷", "+597", "###-####", "SRT", "SRD ($)",
    ["Waterkant","Domineestraat","Henck Arronstraat"],
    [{ city: "Paramaribo", state: "", lat: 5.8520, lng: -55.2038 }],
    stdFmt("Suriname"), () => ""
  ),
  "Guyana": c("🇬🇾", "+592", "###-####", "GYT", "GYD ($)",
    ["Main Street","Camp Street","Regent Street"],
    [{ city: "Georgetown", state: "", lat: 6.8013, lng: -58.1551 }],
    stdFmt("Guyana"), () => ""
  ),

  // ──────── EUROPE ────────
  "United Kingdom": c("🇬🇧", "+44", "07### ######", "GMT/BST", "GBP (£)",
    ["High Street","Church Lane","Mill Road","Station Road","Park Avenue","King Street","Queen Street","Victoria Road","London Road","Bridge Street","Manor Way","Baker Street","Oxford Street","Abbey Road"],
    [
      { city: "London", state: "", lat: 51.5074, lng: -0.1278 },
      { city: "Manchester", state: "", lat: 53.4808, lng: -2.2426 },
      { city: "Birmingham", state: "", lat: 52.4862, lng: -1.8904 },
      { city: "Edinburgh", state: "", lat: 55.9533, lng: -3.1883 },
      { city: "Liverpool", state: "", lat: 53.4084, lng: -2.9916 },
      { city: "Bristol", state: "", lat: 51.4545, lng: -2.5879 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city}\n${a.zip}\nUnited Kingdom`,
    () => `${randChar()}${randChar()}${randNum(1,9)} ${randNum(1,9)}${randChar()}${randChar()}`
  ),
  "Germany": c("🇩🇪", "+49", "01## #######", "CET/CEST", "EUR (€)",
    ["Hauptstraße","Berliner Straße","Schillerstraße","Goethestraße","Bahnhofstraße","Kirchstraße","Gartenstraße","Friedrichstraße","Lindenstraße"],
    [
      { city: "Berlin", state: "", lat: 52.5200, lng: 13.4050 },
      { city: "Munich", state: "", lat: 48.1351, lng: 11.5820 },
      { city: "Hamburg", state: "", lat: 53.5511, lng: 9.9937 },
      { city: "Frankfurt", state: "", lat: 50.1109, lng: 8.6821 },
      { city: "Cologne", state: "", lat: 50.9375, lng: 6.9603 },
    ],
    euFmt("Germany"), zip5
  ),
  "France": c("🇫🇷", "+33", "06 ## ## ## ##", "CET/CEST", "EUR (€)",
    ["Rue de la Paix","Avenue des Champs","Boulevard Saint-Germain","Rue de Rivoli","Rue du Faubourg","Place de la République","Rue Lafayette","Avenue Victor Hugo"],
    [
      { city: "Paris", state: "", lat: 48.8566, lng: 2.3522 },
      { city: "Lyon", state: "", lat: 45.7640, lng: 4.8357 },
      { city: "Marseille", state: "", lat: 43.2965, lng: 5.3698 },
      { city: "Toulouse", state: "", lat: 43.6047, lng: 1.4442 },
      { city: "Nice", state: "", lat: 43.7102, lng: 7.2620 },
    ],
    euFmt("France"), zip5
  ),
  "Italy": c("🇮🇹", "+39", "3## ### ####", "CET/CEST", "EUR (€)",
    ["Via Roma","Via Garibaldi","Corso Vittorio Emanuele","Via Dante","Via Manzoni","Via Verdi","Piazza del Duomo"],
    [
      { city: "Rome", state: "", lat: 41.9028, lng: 12.4964 },
      { city: "Milan", state: "", lat: 45.4642, lng: 9.1900 },
      { city: "Naples", state: "", lat: 40.8518, lng: 14.2681 },
      { city: "Florence", state: "", lat: 43.7696, lng: 11.2558 },
      { city: "Venice", state: "", lat: 45.4408, lng: 12.3155 },
    ],
    euFmt("Italy"), zip5
  ),
  "Spain": c("🇪🇸", "+34", "6## ### ###", "CET/CEST", "EUR (€)",
    ["Calle Mayor","Gran Vía","Paseo de la Castellana","Rambla Catalunya","Calle Serrano","Avenida de la Constitución"],
    [
      { city: "Madrid", state: "", lat: 40.4168, lng: -3.7038 },
      { city: "Barcelona", state: "", lat: 41.3851, lng: 2.1734 },
      { city: "Valencia", state: "", lat: 39.4699, lng: -0.3763 },
      { city: "Seville", state: "", lat: 37.3891, lng: -5.9845 },
    ],
    euFmt("Spain"), zip5
  ),
  "Portugal": c("🇵🇹", "+351", "9## ### ###", "WET", "EUR (€)",
    ["Rua Augusta","Avenida da Liberdade","Rua do Carmo","Rua de Santa Catarina"],
    [
      { city: "Lisbon", state: "", lat: 38.7223, lng: -9.1393 },
      { city: "Porto", state: "", lat: 41.1579, lng: -8.6291 },
    ],
    (a) => `${a.street} ${a.num}\n${a.zip} ${a.city}\nPortugal`,
    () => `${randNum(1000,9999)}-${randNum(100,999)}`
  ),
  "Netherlands": c("🇳🇱", "+31", "06 ########", "CET/CEST", "EUR (€)",
    ["Kalverstraat","Damrak","Keizersgracht","Herengracht","Prinsengracht","Leidsestraat"],
    [
      { city: "Amsterdam", state: "", lat: 52.3676, lng: 4.9041 },
      { city: "Rotterdam", state: "", lat: 51.9244, lng: 4.4777 },
      { city: "The Hague", state: "", lat: 52.0705, lng: 4.3007 },
    ],
    (a) => `${a.street} ${a.num}\n${a.zip} ${a.city}\nNetherlands`,
    () => `${randNum(1000,9999)} ${randChar()}${randChar()}`
  ),
  "Belgium": c("🇧🇪", "+32", "04## ## ## ##", "CET/CEST", "EUR (€)",
    ["Rue Neuve","Avenue Louise","Grand Place","Meir","Rue de la Loi"],
    [
      { city: "Brussels", state: "", lat: 50.8503, lng: 4.3517 },
      { city: "Antwerp", state: "", lat: 51.2194, lng: 4.4025 },
      { city: "Ghent", state: "", lat: 51.0543, lng: 3.7174 },
    ],
    euFmt("Belgium"), zip4
  ),
  "Switzerland": c("🇨🇭", "+41", "07# ### ## ##", "CET/CEST", "CHF (Fr.)",
    ["Bahnhofstrasse","Limmatquai","Kramgasse","Marktgasse","Freie Strasse"],
    [
      { city: "Zurich", state: "", lat: 47.3769, lng: 8.5417 },
      { city: "Geneva", state: "", lat: 46.2044, lng: 6.1432 },
      { city: "Bern", state: "", lat: 46.9480, lng: 7.4474 },
    ],
    euFmt("Switzerland"), zip4
  ),
  "Austria": c("🇦🇹", "+43", "06## ### ####", "CET/CEST", "EUR (€)",
    ["Kärntner Straße","Mariahilfer Straße","Ringstraße","Graben","Getreidegasse"],
    [
      { city: "Vienna", state: "", lat: 48.2082, lng: 16.3738 },
      { city: "Salzburg", state: "", lat: 47.8095, lng: 13.0550 },
      { city: "Innsbruck", state: "", lat: 47.2692, lng: 11.4041 },
    ],
    euFmt("Austria"), zip4
  ),
  "Sweden": c("🇸🇪", "+46", "07#-### ## ##", "CET/CEST", "SEK (kr)",
    ["Drottninggatan","Kungsgatan","Storgatan","Vasagatan","Götgatan"],
    [
      { city: "Stockholm", state: "", lat: 59.3293, lng: 18.0686 },
      { city: "Gothenburg", state: "", lat: 57.7089, lng: 11.9746 },
      { city: "Malmö", state: "", lat: 55.6050, lng: 13.0038 },
    ],
    euFmt("Sweden"), () => `${randNum(100,999)} ${randNum(10,99)}`
  ),
  "Norway": c("🇳🇴", "+47", "4## ## ###", "CET/CEST", "NOK (kr)",
    ["Karl Johans gate","Storgata","Bogstadveien","Grünerløkka"],
    [
      { city: "Oslo", state: "", lat: 59.9139, lng: 10.7522 },
      { city: "Bergen", state: "", lat: 60.3913, lng: 5.3221 },
      { city: "Trondheim", state: "", lat: 63.4305, lng: 10.3951 },
    ],
    euFmt("Norway"), zip4
  ),
  "Denmark": c("🇩🇰", "+45", "## ## ## ##", "CET/CEST", "DKK (kr)",
    ["Strøget","Nyhavn","Vesterbrogade","Gothersgade","Bredgade"],
    [
      { city: "Copenhagen", state: "", lat: 55.6761, lng: 12.5683 },
      { city: "Aarhus", state: "", lat: 56.1629, lng: 10.2039 },
    ],
    euFmt("Denmark"), zip4
  ),
  "Finland": c("🇫🇮", "+358", "04# ### ####", "EET/EEST", "EUR (€)",
    ["Mannerheimintie","Aleksanterinkatu","Esplanadi","Hämeenkatu"],
    [
      { city: "Helsinki", state: "", lat: 60.1699, lng: 24.9384 },
      { city: "Tampere", state: "", lat: 61.4978, lng: 23.7610 },
    ],
    euFmt("Finland"), zip5
  ),
  "Iceland": c("🇮🇸", "+354", "### ####", "GMT", "ISK (kr)",
    ["Laugavegur","Skólavörðustígur","Bankastræti","Hverfisgata"],
    [{ city: "Reykjavik", state: "", lat: 64.1466, lng: -21.9426 }],
    stdFmt("Iceland"), () => String(randNum(100, 999))
  ),
  "Ireland": c("🇮🇪", "+353", "08# ### ####", "GMT/IST", "EUR (€)",
    ["O'Connell Street","Grafton Street","Henry Street","Temple Bar"],
    [
      { city: "Dublin", state: "", lat: 53.3498, lng: -6.2603 },
      { city: "Cork", state: "", lat: 51.8985, lng: -8.4756 },
      { city: "Galway", state: "", lat: 53.2707, lng: -9.0568 },
    ],
    stdFmt("Ireland"), () => `${randChar()}${randNum(10,99)} ${randChar()}${randChar()}${randNum(10,99)}`
  ),
  "Poland": c("🇵🇱", "+48", "5## ### ###", "CET/CEST", "PLN (zł)",
    ["Nowy Świat","Krakowskie Przedmieście","Marszałkowska","Floriańska","Długa"],
    [
      { city: "Warsaw", state: "", lat: 52.2297, lng: 21.0122 },
      { city: "Kraków", state: "", lat: 50.0647, lng: 19.9450 },
      { city: "Gdańsk", state: "", lat: 54.3520, lng: 18.6466 },
      { city: "Wrocław", state: "", lat: 51.1079, lng: 17.0385 },
    ],
    (a) => `${a.street} ${a.num}\n${a.zip} ${a.city}\nPoland`,
    () => `${randNum(10,99)}-${randNum(100,999)}`
  ),
  "Czech Republic": c("🇨🇿", "+420", "7## ### ###", "CET/CEST", "CZK (Kč)",
    ["Václavské náměstí","Karlova","Na Příkopě","Národní třída"],
    [
      { city: "Prague", state: "", lat: 50.0755, lng: 14.4378 },
      { city: "Brno", state: "", lat: 49.1951, lng: 16.6068 },
    ],
    euFmt("Czech Republic"), () => `${randNum(100,999)} ${randNum(10,99)}`
  ),
  "Slovakia": c("🇸🇰", "+421", "09## ### ###", "CET/CEST", "EUR (€)",
    ["Obchodná","Michalská","Hlavné námestie","Štúrova"],
    [{ city: "Bratislava", state: "", lat: 48.1486, lng: 17.1077 }, { city: "Košice", state: "", lat: 48.7164, lng: 21.2611 }],
    euFmt("Slovakia"), () => `${randNum(100,999)} ${randNum(10,99)}`
  ),
  "Hungary": c("🇭🇺", "+36", "20 ### ####", "CET/CEST", "HUF (Ft)",
    ["Andrássy út","Váci utca","Rákóczi út","Dohány utca"],
    [{ city: "Budapest", state: "", lat: 47.4979, lng: 19.0402 }, { city: "Debrecen", state: "", lat: 47.5316, lng: 21.6273 }],
    euFmt("Hungary"), zip4
  ),
  "Romania": c("🇷🇴", "+40", "07## ### ###", "EET/EEST", "RON (lei)",
    ["Calea Victoriei","Bulevardul Unirii","Strada Lipscani","Bulevardul Eroilor"],
    [
      { city: "Bucharest", state: "", lat: 44.4268, lng: 26.1025 },
      { city: "Cluj-Napoca", state: "", lat: 46.7712, lng: 23.6236 },
    ],
    euFmt("Romania"), () => String(randNum(100000, 999999))
  ),
  "Bulgaria": c("🇧🇬", "+359", "08## ### ###", "EET/EEST", "BGN (лв)",
    ["Vitosha Boulevard","Graf Ignatiev","Tsar Osvoboditel Boulevard"],
    [{ city: "Sofia", state: "", lat: 42.6977, lng: 23.3219 }, { city: "Plovdiv", state: "", lat: 42.1354, lng: 24.7453 }],
    euFmt("Bulgaria"), zip4
  ),
  "Greece": c("🇬🇷", "+30", "69# ### ####", "EET/EEST", "EUR (€)",
    ["Ermou","Panepistimiou","Stadiou","Voukourestiou","Tsimiski"],
    [
      { city: "Athens", state: "", lat: 37.9838, lng: 23.7275 },
      { city: "Thessaloniki", state: "", lat: 40.6401, lng: 22.9444 },
    ],
    euFmt("Greece"), () => `${randNum(100,999)} ${randNum(10,99)}`
  ),
  "Croatia": c("🇭🇷", "+385", "09# ### ####", "CET/CEST", "EUR (€)",
    ["Ilica","Tkalčićeva","Stradun","Marulićev trg"],
    [{ city: "Zagreb", state: "", lat: 45.8150, lng: 15.9819 }, { city: "Split", state: "", lat: 43.5081, lng: 16.4402 }, { city: "Dubrovnik", state: "", lat: 42.6507, lng: 18.0944 }],
    euFmt("Croatia"), zip5
  ),
  "Serbia": c("🇷🇸", "+381", "06# ### ####", "CET/CEST", "RSD (din.)",
    ["Knez Mihailova","Terazije","Bulevar kralja Aleksandra"],
    [{ city: "Belgrade", state: "", lat: 44.7866, lng: 20.4489 }, { city: "Novi Sad", state: "", lat: 45.2671, lng: 19.8335 }],
    euFmt("Serbia"), zip5
  ),
  "Slovenia": c("🇸🇮", "+386", "04# ### ###", "CET/CEST", "EUR (€)",
    ["Čopova ulica","Prešernov trg","Slovenska cesta"],
    [{ city: "Ljubljana", state: "", lat: 46.0569, lng: 14.5058 }],
    euFmt("Slovenia"), zip4
  ),
  "Bosnia and Herzegovina": c("🇧🇦", "+387", "06# ### ###", "CET/CEST", "BAM (KM)",
    ["Ferhadija","Maršala Tita","Baščaršija"],
    [{ city: "Sarajevo", state: "", lat: 43.8563, lng: 18.4131 }],
    euFmt("Bosnia and Herzegovina"), zip5
  ),
  "Montenegro": c("🇲🇪", "+382", "06# ### ###", "CET/CEST", "EUR (€)",
    ["Slobode","Njegoševa","Stari Grad"],
    [{ city: "Podgorica", state: "", lat: 42.4304, lng: 19.2594 }],
    euFmt("Montenegro"), zip5
  ),
  "North Macedonia": c("🇲🇰", "+389", "07# ### ###", "CET/CEST", "MKD (ден)",
    ["Macedonia Street","Makedonija","Partizanski Odredi"],
    [{ city: "Skopje", state: "", lat: 41.9981, lng: 21.4254 }],
    euFmt("North Macedonia"), zip4
  ),
  "Albania": c("🇦🇱", "+355", "06# ### ####", "CET/CEST", "ALL (L)",
    ["Bulevardi Dëshmorët e Kombit","Rruga Myslym Shyri","Rruga e Barrikadave"],
    [{ city: "Tirana", state: "", lat: 41.3275, lng: 19.8187 }],
    euFmt("Albania"), zip4
  ),
  "Kosovo": c("🇽🇰", "+383", "04# ### ###", "CET/CEST", "EUR (€)",
    ["Bulevardi Nënë Tereza","Rruga UCK","Rruga Agim Ramadani"],
    [{ city: "Pristina", state: "", lat: 42.6629, lng: 21.1655 }],
    euFmt("Kosovo"), zip5
  ),
  "Ukraine": c("🇺🇦", "+380", "0## ### ####", "EET/EEST", "UAH (₴)",
    ["Khreshchatyk","Andriyivskyy","Volodymyrska","Hrushevskoho"],
    [
      { city: "Kyiv", state: "", lat: 50.4501, lng: 30.5234 },
      { city: "Lviv", state: "", lat: 49.8397, lng: 24.0297 },
      { city: "Odessa", state: "", lat: 46.4825, lng: 30.7233 },
    ],
    euFmt("Ukraine"), zip5
  ),
  "Belarus": c("🇧🇾", "+375", "29 ### ## ##", "MSK", "BYN (Br)",
    ["Praspekt Niezaliežnasci","Vulica Lienina","Praspekt Pieramožcaŭ"],
    [{ city: "Minsk", state: "", lat: 53.9045, lng: 27.5615 }],
    euFmt("Belarus"), () => String(randNum(100000, 999999))
  ),
  "Moldova": c("🇲🇩", "+373", "06# ### ###", "EET/EEST", "MDL (L)",
    ["Bulevardul Ștefan cel Mare","Strada Pușkin","Strada București"],
    [{ city: "Chișinău", state: "", lat: 47.0105, lng: 28.8638 }],
    euFmt("Moldova"), () => `MD-${randNum(1000,9999)}`
  ),
  "Lithuania": c("🇱🇹", "+370", "6## #####", "EET/EEST", "EUR (€)",
    ["Gedimino prospektas","Pilies gatvė","Vokiečių gatvė"],
    [{ city: "Vilnius", state: "", lat: 54.6872, lng: 25.2797 }, { city: "Kaunas", state: "", lat: 54.8985, lng: 23.9036 }],
    (a) => `${a.street} ${a.num}\nLT-${a.zip} ${a.city}\nLithuania`,
    zip5
  ),
  "Latvia": c("🇱🇻", "+371", "2# ### ###", "EET/EEST", "EUR (€)",
    ["Brīvības iela","Kaļķu iela","Tērbatas iela"],
    [{ city: "Riga", state: "", lat: 56.9496, lng: 24.1052 }],
    (a) => `${a.street} ${a.num}\nLV-${a.zip} ${a.city}\nLatvia`,
    zip4
  ),
  "Estonia": c("🇪🇪", "+372", "5### ####", "EET/EEST", "EUR (€)",
    ["Viru","Pikk","Narva maantee","Pärnu maantee"],
    [{ city: "Tallinn", state: "", lat: 59.4370, lng: 24.7536 }],
    euFmt("Estonia"), zip5
  ),
  "Luxembourg": c("🇱🇺", "+352", "6## ### ###", "CET/CEST", "EUR (€)",
    ["Grand-Rue","Avenue de la Liberté","Rue Philippe II"],
    [{ city: "Luxembourg City", state: "", lat: 49.6116, lng: 6.1319 }],
    euFmt("Luxembourg"), zip4
  ),
  "Malta": c("🇲🇹", "+356", "79## ####", "CET/CEST", "EUR (€)",
    ["Republic Street","Merchants Street","St Paul's Street"],
    [{ city: "Valletta", state: "", lat: 35.8989, lng: 14.5146 }],
    stdFmt("Malta"), () => `${randChar()}${randChar()}${randChar()} ${randNum(1000,9999)}`
  ),
  "Cyprus": c("🇨🇾", "+357", "9# ######", "EET/EEST", "EUR (€)",
    ["Makarios Avenue","Ledra Street","Onasagorou Street"],
    [{ city: "Nicosia", state: "", lat: 35.1856, lng: 33.3823 }, { city: "Limassol", state: "", lat: 34.7071, lng: 33.0226 }],
    euFmt("Cyprus"), zip4
  ),
  "Russia": c("🇷🇺", "+7", "9## ###-##-##", "MSK", "RUB (₽)",
    ["Nevsky Prospekt","Tverskaya","Arbat","Kutuzovsky Prospekt","Leninsky Prospekt"],
    [
      { city: "Moscow", state: "", lat: 55.7558, lng: 37.6173 },
      { city: "Saint Petersburg", state: "", lat: 59.9343, lng: 30.3351 },
      { city: "Novosibirsk", state: "", lat: 55.0084, lng: 82.9357 },
    ],
    euFmt("Russia"), () => String(randNum(100000, 999999))
  ),
  "Georgia": c("🇬🇪", "+995", "5## ## ## ##", "GET", "GEL (₾)",
    ["Rustaveli Avenue","Aghmashenebeli Avenue","Chavchavadze Avenue"],
    [{ city: "Tbilisi", state: "", lat: 41.7151, lng: 44.8271 }, { city: "Batumi", state: "", lat: 41.6168, lng: 41.6367 }],
    euFmt("Georgia"), zip4
  ),
  "Armenia": c("🇦🇲", "+374", "9# ### ###", "AMT", "AMD (֏)",
    ["Northern Avenue","Abovyan Street","Mashtots Avenue"],
    [{ city: "Yerevan", state: "", lat: 40.1792, lng: 44.4991 }],
    euFmt("Armenia"), zip4
  ),
  "Azerbaijan": c("🇦🇿", "+994", "5# ### ## ##", "AZT", "AZN (₼)",
    ["Nizami Street","Fountain Square","Istiglaliyyat"],
    [{ city: "Baku", state: "", lat: 40.4093, lng: 49.8671 }],
    (a) => `${a.street} ${a.num}\nAZ ${a.zip} ${a.city}\nAzerbaijan`,
    zip4
  ),

  // ──────── MIDDLE EAST ────────
  "Turkey": c("🇹🇷", "+90", "5## ### ## ##", "TRT", "TRY (₺)",
    ["İstiklal Caddesi","Bağdat Caddesi","Atatürk Bulvarı","Tunalı Hilmi Caddesi","Kızılay Meydanı","Nişantaşı"],
    [
      { city: "Istanbul", state: "", lat: 41.0082, lng: 28.9784 },
      { city: "Ankara", state: "", lat: 39.9334, lng: 32.8597 },
      { city: "Izmir", state: "", lat: 38.4237, lng: 27.1428 },
      { city: "Antalya", state: "", lat: 36.8969, lng: 30.7133 },
    ],
    euFmt("Turkey"), zip5
  ),
  "Saudi Arabia": c("🇸🇦", "+966", "5# ### ####", "AST", "SAR (﷼)",
    ["King Fahd Road","Olaya Street","Tahlia Street","Prince Sultan Road","King Abdullah Road","Corniche Road"],
    [
      { city: "Riyadh", state: "", lat: 24.7136, lng: 46.6753 },
      { city: "Jeddah", state: "", lat: 21.4858, lng: 39.1925 },
      { city: "Mecca", state: "", lat: 21.3891, lng: 39.8579 },
      { city: "Medina", state: "", lat: 24.5247, lng: 39.5692 },
      { city: "Dammam", state: "", lat: 26.3927, lng: 49.9777 },
    ],
    stdFmt("Saudi Arabia"), zip5
  ),
  "United Arab Emirates": c("🇦🇪", "+971", "5# ### ####", "GST", "AED (د.إ)",
    ["Sheikh Zayed Road","Jumeirah Beach Road","Al Maktoum Road","Corniche Road","Hamdan Street","Al Wahda Street"],
    [
      { city: "Dubai", state: "", lat: 25.2048, lng: 55.2708 },
      { city: "Abu Dhabi", state: "", lat: 24.4539, lng: 54.3773 },
      { city: "Sharjah", state: "", lat: 25.3463, lng: 55.4209 },
      { city: "Ajman", state: "", lat: 25.4052, lng: 55.5136 },
    ],
    stdFmt("United Arab Emirates"), () => ""
  ),
  "Qatar": c("🇶🇦", "+974", "## ### ###", "AST", "QAR (﷼)",
    ["Corniche Street","Al Sadd Street","Pearl Boulevard","Lusail Boulevard"],
    [{ city: "Doha", state: "", lat: 25.2854, lng: 51.5310 }],
    stdFmt("Qatar"), () => ""
  ),
  "Kuwait": c("🇰🇼", "+965", "#### ####", "AST", "KWD (د.ك)",
    ["Gulf Road","Salem Al Mubarak Street","Fahad Al Salem Street"],
    [{ city: "Kuwait City", state: "", lat: 29.3759, lng: 47.9774 }],
    stdFmt("Kuwait"), zip5
  ),
  "Bahrain": c("🇧🇭", "+973", "3### ####", "AST", "BHD (.د.ب)",
    ["Government Avenue","Exhibition Road","King Faisal Highway"],
    [{ city: "Manama", state: "", lat: 26.2285, lng: 50.5860 }],
    stdFmt("Bahrain"), () => String(randNum(100, 999))
  ),
  "Oman": c("🇴🇲", "+968", "9### ####", "GST", "OMR (﷼)",
    ["Sultan Qaboos Street","Al Qurum Street","Muttrah Corniche"],
    [{ city: "Muscat", state: "", lat: 23.5880, lng: 58.3829 }],
    stdFmt("Oman"), () => String(randNum(100, 999))
  ),
  "Yemen": c("🇾🇪", "+967", "7## ### ###", "AST", "YER (﷼)",
    ["Zubairi Street","Haddah Street","Ring Road"],
    [{ city: "Sana'a", state: "", lat: 15.3694, lng: 44.1910 }],
    stdFmt("Yemen"), () => ""
  ),
  "Iraq": c("🇮🇶", "+964", "7## ### ####", "AST", "IQD (ع.د)",
    ["Rashid Street","Sadoun Street","Karada Street","Al Mansour","Abu Nuwas Street"],
    [
      { city: "Baghdad", state: "", lat: 33.3152, lng: 44.3661 },
      { city: "Erbil", state: "", lat: 36.1901, lng: 44.0089 },
      { city: "Basra", state: "", lat: 30.5085, lng: 47.7804 },
    ],
    stdFmt("Iraq"), zip5
  ),
  "Iran": c("🇮🇷", "+98", "9## ### ####", "IRST", "IRR (﷼)",
    ["Valiasr Street","Enghelab Street","Taleghani Avenue","Ferdowsi Street"],
    [
      { city: "Tehran", state: "", lat: 35.6892, lng: 51.3890 },
      { city: "Isfahan", state: "", lat: 32.6546, lng: 51.6680 },
      { city: "Shiraz", state: "", lat: 29.5918, lng: 52.5837 },
    ],
    stdFmt("Iran"), () => String(randNum(1000000000, 9999999999))
  ),
  "Jordan": c("🇯🇴", "+962", "7#### ####", "EET", "JOD (د.ا)",
    ["Rainbow Street","Mecca Street","Zahran Street","King Hussein Street"],
    [{ city: "Amman", state: "", lat: 31.9454, lng: 35.9284 }],
    stdFmt("Jordan"), zip5
  ),
  "Lebanon": c("🇱🇧", "+961", "0# ### ###", "EET", "LBP (ل.ل)",
    ["Hamra Street","Gemmayzeh","Mar Mikhael","Achrafieh"],
    [{ city: "Beirut", state: "", lat: 33.8938, lng: 35.5018 }],
    stdFmt("Lebanon"), () => `${randNum(1000,9999)} ${randNum(1000,9999)}`
  ),
  "Israel": c("🇮🇱", "+972", "05#-###-####", "IST", "ILS (₪)",
    ["Rothschild Boulevard","Dizengoff Street","Ben Yehuda Street","Jaffa Street"],
    [
      { city: "Tel Aviv", state: "", lat: 32.0853, lng: 34.7818 },
      { city: "Jerusalem", state: "", lat: 31.7683, lng: 35.2137 },
      { city: "Haifa", state: "", lat: 32.7940, lng: 34.9896 },
    ],
    stdFmt("Israel"), () => String(randNum(1000000, 9999999))
  ),
  "Palestine": c("🇵🇸", "+970", "59# ### ###", "EET", "ILS (₪)",
    ["Al-Manara Square","Main Street","Old City Road"],
    [{ city: "Ramallah", state: "", lat: 31.9038, lng: 35.2034 }, { city: "Gaza City", state: "", lat: 31.5000, lng: 34.4667 }],
    stdFmt("Palestine"), () => ""
  ),
  "Syria": c("🇸🇾", "+963", "09## ### ###", "EET", "SYP (£)",
    ["Straight Street","Al-Hamidiyah","Shoukry Al-Quwatly"],
    [{ city: "Damascus", state: "", lat: 33.5138, lng: 36.2765 }, { city: "Aleppo", state: "", lat: 36.2021, lng: 37.1343 }],
    stdFmt("Syria"), () => ""
  ),

  // ──────── SOUTH ASIA ────────
  "India": c("🇮🇳", "+91", "9#########", "IST", "INR (₹)",
    ["MG Road","Brigade Road","Park Street","Connaught Place","Marine Drive","Juhu Road","Linking Road","Anna Salai","Mount Road","Residency Road","FC Road","Law Garden Road"],
    [
      { city: "Mumbai", state: "MH", lat: 19.0760, lng: 72.8777 },
      { city: "Delhi", state: "DL", lat: 28.7041, lng: 77.1025 },
      { city: "Bangalore", state: "KA", lat: 12.9716, lng: 77.5946 },
      { city: "Chennai", state: "TN", lat: 13.0827, lng: 80.2707 },
      { city: "Kolkata", state: "WB", lat: 22.5726, lng: 88.3639 },
      { city: "Hyderabad", state: "TS", lat: 17.3850, lng: 78.4867 },
    ],
    (a) => `${a.num}, ${a.street}\n${a.city}, ${a.state} ${a.zip}\nIndia`,
    zip6
  ),
  "Bangladesh": c("🇧🇩", "+880", "01#########", "BST", "BDT (৳)",
    ["Dhanmondi Rd","Gulshan Ave","Mirpur Rd","Banani Road","Uttara Sector","Mohammadpur Rd","Old Dhaka Lane","Chittagong Rd","Motijheel C/A","Farmgate Road"],
    [
      { city: "Dhaka", state: "", lat: 23.8103, lng: 90.4125 },
      { city: "Chittagong", state: "", lat: 22.3569, lng: 91.7832 },
      { city: "Sylhet", state: "", lat: 24.8949, lng: 91.8687 },
      { city: "Rajshahi", state: "", lat: 24.3745, lng: 88.6042 },
      { city: "Khulna", state: "", lat: 22.8456, lng: 89.5403 },
      { city: "Comilla", state: "", lat: 23.4607, lng: 91.1809 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city} ${a.zip}\nBangladesh`,
    zip4
  ),
  "Pakistan": c("🇵🇰", "+92", "3## #######", "PKT", "PKR (₨)",
    ["Mall Road","Jinnah Avenue","Shahrah-e-Faisal","GT Road","Murree Road","Blue Area","Tariq Road","M.A. Jinnah Road","Constitution Avenue"],
    [
      { city: "Karachi", state: "Sindh", lat: 24.8607, lng: 67.0011 },
      { city: "Lahore", state: "Punjab", lat: 31.5204, lng: 74.3587 },
      { city: "Islamabad", state: "ICT", lat: 33.6844, lng: 73.0479 },
      { city: "Rawalpindi", state: "Punjab", lat: 33.5651, lng: 73.0169 },
      { city: "Faisalabad", state: "Punjab", lat: 31.4504, lng: 73.1350 },
      { city: "Peshawar", state: "KPK", lat: 34.0151, lng: 71.5249 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nPakistan`,
    zip5
  ),
  "Sri Lanka": c("🇱🇰", "+94", "07# ### ####", "SLST", "LKR (Rs)",
    ["Galle Road","Duplication Road","Flower Road","R.A. De Mel Mawatha"],
    [
      { city: "Colombo", state: "", lat: 6.9271, lng: 79.8612 },
      { city: "Kandy", state: "", lat: 7.2906, lng: 80.6337 },
    ],
    stdFmt("Sri Lanka"), zip5
  ),
  "Nepal": c("🇳🇵", "+977", "98########", "NPT", "NPR (₨)",
    ["Durbar Marg","New Baneshwor","Thamel","Kantipath","Putalisadak"],
    [
      { city: "Kathmandu", state: "", lat: 27.7172, lng: 85.3240 },
      { city: "Pokhara", state: "", lat: 28.2096, lng: 83.9856 },
    ],
    stdFmt("Nepal"), zip5
  ),
  "Bhutan": c("🇧🇹", "+975", "17 ## ## ##", "BTT", "BTN (Nu.)",
    ["Norzin Lam","Chang Lam","Doebum Lam"],
    [{ city: "Thimphu", state: "", lat: 27.4728, lng: 89.6390 }],
    stdFmt("Bhutan"), zip5
  ),
  "Maldives": c("🇲🇻", "+960", "7######", "MVT", "MVR (Rf)",
    ["Majeedhee Magu","Boduthakurufaanu Magu","Chaandhanee Magu"],
    [{ city: "Malé", state: "", lat: 4.1755, lng: 73.5093 }],
    stdFmt("Maldives"), zip5
  ),
  "Afghanistan": c("🇦🇫", "+93", "07## ### ###", "AFT", "AFN (؋)",
    ["Chicken Street","Flower Street","Jada-e-Maiwand"],
    [{ city: "Kabul", state: "", lat: 34.5553, lng: 69.2075 }, { city: "Herat", state: "", lat: 34.3529, lng: 62.2040 }],
    stdFmt("Afghanistan"), zip4
  ),

  // ──────── EAST ASIA ────────
  "Japan": c("🇯🇵", "+81", "090-####-####", "JST", "JPY (¥)",
    ["Shibuya","Shinjuku","Ginza","Akihabara","Roppongi","Harajuku","Ikebukuro","Asakusa","Ueno","Odaiba"],
    [
      { city: "Tokyo", state: "", lat: 35.6762, lng: 139.6503 },
      { city: "Osaka", state: "", lat: 34.6937, lng: 135.5023 },
      { city: "Kyoto", state: "", lat: 35.0116, lng: 135.7681 },
      { city: "Yokohama", state: "", lat: 35.4437, lng: 139.6380 },
      { city: "Fukuoka", state: "", lat: 33.5904, lng: 130.4017 },
    ],
    (a) => `${a.zip}\n${a.city}, ${a.street} ${a.num}\nJapan`,
    () => `${randNum(100,999)}-${randNum(1000,9999)}`
  ),
  "South Korea": c("🇰🇷", "+82", "010-####-####", "KST", "KRW (₩)",
    ["Gangnam-daero","Teheran-ro","Myeongdong-gil","Sejong-daero","Itaewon-ro","Hongdae","Bukchon-ro","Insadong-gil"],
    [
      { city: "Seoul", state: "", lat: 37.5665, lng: 126.9780 },
      { city: "Busan", state: "", lat: 35.1796, lng: 129.0756 },
      { city: "Incheon", state: "", lat: 37.4563, lng: 126.7052 },
      { city: "Daegu", state: "", lat: 35.8714, lng: 128.6014 },
      { city: "Jeju", state: "", lat: 33.4996, lng: 126.5312 },
    ],
    (a) => `${a.city} ${a.street} ${a.num}\n${a.zip}\nSouth Korea`,
    zip5
  ),
  "China": c("🇨🇳", "+86", "1## #### ####", "CST", "CNY (¥)",
    ["Nanjing Road","Chang'an Avenue","Wangfujing","Huaihai Road","Beijing Road","Zhongshan Road"],
    [
      { city: "Beijing", state: "", lat: 39.9042, lng: 116.4074 },
      { city: "Shanghai", state: "", lat: 31.2304, lng: 121.4737 },
      { city: "Guangzhou", state: "", lat: 23.1291, lng: 113.2644 },
      { city: "Shenzhen", state: "", lat: 22.5431, lng: 114.0579 },
      { city: "Chengdu", state: "", lat: 30.5728, lng: 104.0668 },
    ],
    (a) => `${a.city} ${a.street} ${a.num}\n${a.zip}\nChina`,
    () => String(randNum(100000, 999999))
  ),
  "Taiwan": c("🇹🇼", "+886", "09## ### ###", "CST", "TWD (NT$)",
    ["Zhongxiao Road","Xinyi Road","Dunhua Road","Renai Road"],
    [
      { city: "Taipei", state: "", lat: 25.0330, lng: 121.5654 },
      { city: "Kaohsiung", state: "", lat: 22.6273, lng: 120.3014 },
    ],
    (a) => `${a.zip} ${a.city}\n${a.street} ${a.num}\nTaiwan`,
    () => String(randNum(100, 999))
  ),
  "Hong Kong": c("🇭🇰", "+852", "#### ####", "HKT", "HKD ($)",
    ["Nathan Road","Queen's Road","Des Voeux Road","Hennessy Road"],
    [{ city: "Hong Kong", state: "", lat: 22.3193, lng: 114.1694 }],
    (a) => `${a.num} ${a.street}\n${a.city}`,
    () => ""
  ),
  "Mongolia": c("🇲🇳", "+976", "## ## ####", "ULAT", "MNT (₮)",
    ["Peace Avenue","Seoul Street","Tokyo Street"],
    [{ city: "Ulaanbaatar", state: "", lat: 47.8864, lng: 106.9057 }],
    stdFmt("Mongolia"), () => String(randNum(10000, 99999))
  ),
  "North Korea": c("🇰🇵", "+850", "## ### ####", "KST", "KPW (₩)",
    ["Chongchun Street","Ryomyong Street","Kwangbok Street"],
    [{ city: "Pyongyang", state: "", lat: 39.0392, lng: 125.7625 }],
    stdFmt("North Korea"), () => ""
  ),

  // ──────── SOUTHEAST ASIA ────────
  "Thailand": c("🇹🇭", "+66", "08# ### ####", "ICT", "THB (฿)",
    ["Sukhumvit Road","Silom Road","Khao San Road","Ratchadamri Road","Charoen Krung Road","Rama IV Road"],
    [
      { city: "Bangkok", state: "", lat: 13.7563, lng: 100.5018 },
      { city: "Chiang Mai", state: "", lat: 18.7883, lng: 98.9853 },
      { city: "Phuket", state: "", lat: 7.8804, lng: 98.3923 },
      { city: "Pattaya", state: "", lat: 12.9236, lng: 100.8825 },
    ],
    stdFmt("Thailand"), zip5
  ),
  "Vietnam": c("🇻🇳", "+84", "09# ### ## ##", "ICT", "VND (₫)",
    ["Pham Ngu Lao","Le Loi","Nguyen Hue","Dong Khoi","Hang Bai","Trang Tien"],
    [
      { city: "Ho Chi Minh City", state: "", lat: 10.8231, lng: 106.6297 },
      { city: "Hanoi", state: "", lat: 21.0278, lng: 105.8342 },
      { city: "Da Nang", state: "", lat: 16.0544, lng: 108.2022 },
    ],
    stdFmt("Vietnam"), () => String(randNum(100000, 999999))
  ),
  "Philippines": c("🇵🇭", "+63", "9## ### ####", "PHT", "PHP (₱)",
    ["Ayala Avenue","EDSA","Roxas Boulevard","Taft Avenue","Mactan Road","Session Road"],
    [
      { city: "Manila", state: "", lat: 14.5995, lng: 120.9842 },
      { city: "Cebu City", state: "", lat: 10.3157, lng: 123.8854 },
      { city: "Davao City", state: "", lat: 7.1907, lng: 125.4553 },
    ],
    stdFmt("Philippines"), zip4
  ),
  "Malaysia": c("🇲🇾", "+60", "01#-### ####", "MYT", "MYR (RM)",
    ["Jalan Bukit Bintang","Jalan Sultan","Jalan Petaling","Jalan Tun Razak","Jalan Ampang"],
    [
      { city: "Kuala Lumpur", state: "", lat: 3.1390, lng: 101.6869 },
      { city: "George Town", state: "Penang", lat: 5.4141, lng: 100.3288 },
      { city: "Johor Bahru", state: "Johor", lat: 1.4927, lng: 103.7414 },
    ],
    stdFmt("Malaysia"), zip5
  ),
  "Singapore": c("🇸🇬", "+65", "9### ####", "SGT", "SGD ($)",
    ["Orchard Road","Marina Bay","Shenton Way","Cecil Street","Raffles Place"],
    [{ city: "Singapore", state: "", lat: 1.3521, lng: 103.8198 }],
    (a) => `${a.num} ${a.street}\nSingapore ${a.zip}`,
    () => String(randNum(100000, 999999))
  ),
  "Indonesia": c("🇮🇩", "+62", "08## #### ####", "WIB", "IDR (Rp)",
    ["Jalan Sudirman","Jalan Thamrin","Jalan Malioboro","Jalan Gatot Subroto","Jalan Asia Afrika"],
    [
      { city: "Jakarta", state: "", lat: -6.2088, lng: 106.8456 },
      { city: "Bali", state: "", lat: -8.3405, lng: 115.0920 },
      { city: "Surabaya", state: "", lat: -7.2575, lng: 112.7521 },
      { city: "Bandung", state: "", lat: -6.9175, lng: 107.6191 },
    ],
    stdFmt("Indonesia"), zip5
  ),
  "Myanmar": c("🇲🇲", "+95", "09 ### ######", "MMT", "MMK (K)",
    ["Bogyoke Aung San Road","Anawrahta Road","Sule Pagoda Road"],
    [{ city: "Yangon", state: "", lat: 16.8661, lng: 96.1951 }, { city: "Mandalay", state: "", lat: 21.9588, lng: 96.0891 }],
    stdFmt("Myanmar"), zip5
  ),
  "Cambodia": c("🇰🇭", "+855", "0## ### ###", "ICT", "KHR (៛)",
    ["Monivong Boulevard","Norodom Boulevard","Sisowath Quay","Street 240"],
    [{ city: "Phnom Penh", state: "", lat: 11.5564, lng: 104.9282 }, { city: "Siem Reap", state: "", lat: 13.3633, lng: 103.8564 }],
    stdFmt("Cambodia"), zip5
  ),
  "Laos": c("🇱🇦", "+856", "20## ### ###", "ICT", "LAK (₭)",
    ["Setthathirath Road","Samsenthai Road","Thanon Chao Anou"],
    [{ city: "Vientiane", state: "", lat: 17.9757, lng: 102.6331 }],
    stdFmt("Laos"), zip5
  ),
  "Brunei": c("🇧🇳", "+673", "### ####", "BNT", "BND ($)",
    ["Jalan Sultan","Jalan Tutong","Jalan Gadong"],
    [{ city: "Bandar Seri Begawan", state: "", lat: 4.9031, lng: 114.9398 }],
    stdFmt("Brunei"), () => `${randChar()}${randChar()}${randNum(1000,9999)}`
  ),
  "Timor-Leste": c("🇹🇱", "+670", "7### ####", "TLT", "USD ($)",
    ["Avenida de Portugal","Rua de Caicoli"],
    [{ city: "Dili", state: "", lat: -8.5569, lng: 125.5603 }],
    stdFmt("Timor-Leste"), () => ""
  ),

  // ──────── CENTRAL ASIA ────────
  "Kazakhstan": c("🇰🇿", "+7", "7## ### ## ##", "ALMT", "KZT (₸)",
    ["Abay Avenue","Dostyk Avenue","Nazarbayev Avenue","Republic Avenue"],
    [{ city: "Almaty", state: "", lat: 43.2220, lng: 76.8512 }, { city: "Astana", state: "", lat: 51.1694, lng: 71.4491 }],
    stdFmt("Kazakhstan"), () => String(randNum(100000, 999999))
  ),
  "Uzbekistan": c("🇺🇿", "+998", "9# ### ## ##", "UZT", "UZS (сўм)",
    ["Amir Temur Avenue","Navoi Street","Mustaqillik Square"],
    [{ city: "Tashkent", state: "", lat: 41.2995, lng: 69.2401 }, { city: "Samarkand", state: "", lat: 39.6542, lng: 66.9597 }],
    stdFmt("Uzbekistan"), () => String(randNum(100000, 999999))
  ),
  "Turkmenistan": c("🇹🇲", "+993", "6# ## ## ##", "TMT", "TMT (m)",
    ["Magtymguly Avenue","Turkmenbashy Avenue"],
    [{ city: "Ashgabat", state: "", lat: 37.9601, lng: 58.3261 }],
    stdFmt("Turkmenistan"), () => String(randNum(100000, 999999))
  ),
  "Kyrgyzstan": c("🇰🇬", "+996", "7## ### ###", "KGT", "KGS (сом)",
    ["Chuy Avenue","Manas Avenue","Erkindik Boulevard"],
    [{ city: "Bishkek", state: "", lat: 42.8746, lng: 74.5698 }],
    stdFmt("Kyrgyzstan"), () => String(randNum(100000, 999999))
  ),
  "Tajikistan": c("🇹🇯", "+992", "9## ## ## ##", "TJT", "TJS (SM)",
    ["Rudaki Avenue","Ismoili Somoni Avenue"],
    [{ city: "Dushanbe", state: "", lat: 38.5598, lng: 68.7738 }],
    stdFmt("Tajikistan"), () => String(randNum(100000, 999999))
  ),

  // ──────── OCEANIA ────────
  "Australia": c("🇦🇺", "+61", "04## ### ###", "AEST/ACST/AWST", "AUD ($)",
    ["George Street","King Street","Collins Street","Pitt Street","Elizabeth Street","Flinders Street","Queen Street","Bourke Street","Swanston Street"],
    [
      { city: "Sydney", state: "NSW", lat: -33.8688, lng: 151.2093 },
      { city: "Melbourne", state: "VIC", lat: -37.8136, lng: 144.9631 },
      { city: "Brisbane", state: "QLD", lat: -27.4698, lng: 153.0251 },
      { city: "Perth", state: "WA", lat: -31.9505, lng: 115.8605 },
      { city: "Adelaide", state: "SA", lat: -34.9285, lng: 138.6007 },
    ],
    (a) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nAustralia`,
    () => String(randNum(2000, 6999))
  ),
  "New Zealand": c("🇳🇿", "+64", "02# ### ####", "NZST", "NZD ($)",
    ["Queen Street","Lambton Quay","Courtenay Place","Ponsonby Road","Cuba Street"],
    [
      { city: "Auckland", state: "", lat: -36.8485, lng: 174.7633 },
      { city: "Wellington", state: "", lat: -41.2865, lng: 174.7762 },
      { city: "Christchurch", state: "", lat: -43.5321, lng: 172.6362 },
    ],
    stdFmt("New Zealand"), zip4
  ),
  "Fiji": c("🇫🇯", "+679", "### ####", "FJT", "FJD ($)",
    ["Victoria Parade","Thomson Street","Kings Road"],
    [{ city: "Suva", state: "", lat: -18.1416, lng: 178.4419 }],
    stdFmt("Fiji"), () => ""
  ),
  "Papua New Guinea": c("🇵🇬", "+675", "7### ####", "PGT", "PGK (K)",
    ["Harbour City Road","Waigani Drive","Boroko Drive"],
    [{ city: "Port Moresby", state: "", lat: -9.4438, lng: 147.1803 }],
    stdFmt("Papua New Guinea"), () => String(randNum(100, 999))
  ),
  "Samoa": c("🇼🇸", "+685", "## ####", "SST", "WST (T)",
    ["Beach Road","Vaitele Street"],
    [{ city: "Apia", state: "", lat: -13.8333, lng: -171.7500 }],
    stdFmt("Samoa"), () => ""
  ),
  "Tonga": c("🇹🇴", "+676", "## ###", "TOT", "TOP (T$)",
    ["Taufa'ahau Road","Vuna Road"],
    [{ city: "Nukuʻalofa", state: "", lat: -21.2087, lng: -175.1982 }],
    stdFmt("Tonga"), () => ""
  ),
  "Vanuatu": c("🇻🇺", "+678", "## #####", "VUT", "VUV (VT)",
    ["Rue Higginson","Kumul Highway"],
    [{ city: "Port Vila", state: "", lat: -17.7334, lng: 168.3220 }],
    stdFmt("Vanuatu"), () => ""
  ),
  "Solomon Islands": c("🇸🇧", "+677", "## ###", "SBT", "SBD ($)",
    ["Mendana Avenue","Hibiscus Avenue"],
    [{ city: "Honiara", state: "", lat: -9.4456, lng: 159.9729 }],
    stdFmt("Solomon Islands"), () => ""
  ),
  "Micronesia": c("🇫🇲", "+691", "### ####", "PONT", "USD ($)",
    ["Main Street"],
    [{ city: "Palikir", state: "", lat: 6.9248, lng: 158.1610 }],
    stdFmt("Micronesia"), () => `969${randNum(10,99)}`
  ),
  "Palau": c("🇵🇼", "+680", "### ####", "PWT", "USD ($)",
    ["Main Street"],
    [{ city: "Ngerulmud", state: "", lat: 7.5006, lng: 134.6243 }],
    stdFmt("Palau"), () => "96940"
  ),
  "Marshall Islands": c("🇲🇭", "+692", "### ####", "MHT", "USD ($)",
    ["Main Street"],
    [{ city: "Majuro", state: "", lat: 7.1164, lng: 171.1858 }],
    stdFmt("Marshall Islands"), () => "96960"
  ),
  "Kiribati": c("🇰🇮", "+686", "## ###", "GILT", "AUD ($)",
    ["Main Road"],
    [{ city: "Tarawa", state: "", lat: 1.4518, lng: 172.9717 }],
    stdFmt("Kiribati"), () => ""
  ),
  "Tuvalu": c("🇹🇻", "+688", "## ###", "TVT", "AUD ($)",
    ["Main Road"],
    [{ city: "Funafuti", state: "", lat: -8.5211, lng: 179.1962 }],
    stdFmt("Tuvalu"), () => ""
  ),
  "Nauru": c("🇳🇷", "+674", "### ####", "NRT", "AUD ($)",
    ["Island Ring Road"],
    [{ city: "Yaren", state: "", lat: -0.5477, lng: 166.9209 }],
    stdFmt("Nauru"), () => ""
  ),

  // ──────── AFRICA ────────
  "South Africa": c("🇿🇦", "+27", "0## ### ####", "SAST", "ZAR (R)",
    ["Long Street","Adderley Street","Commissioner Street","Church Street","Rivonia Road","Oxford Road"],
    [
      { city: "Johannesburg", state: "Gauteng", lat: -26.2041, lng: 28.0473 },
      { city: "Cape Town", state: "Western Cape", lat: -33.9249, lng: 18.4241 },
      { city: "Durban", state: "KZN", lat: -29.8587, lng: 31.0218 },
      { city: "Pretoria", state: "Gauteng", lat: -25.7479, lng: 28.2293 },
    ],
    stdFmt("South Africa"), zip4
  ),
  "Nigeria": c("🇳🇬", "+234", "080# ### ####", "WAT", "NGN (₦)",
    ["Broad Street","Awolowo Road","Allen Avenue","Adeola Odeku Street","Ahmadu Bello Way","Marina"],
    [
      { city: "Lagos", state: "", lat: 6.5244, lng: 3.3792 },
      { city: "Abuja", state: "", lat: 9.0765, lng: 7.3986 },
      { city: "Kano", state: "", lat: 12.0022, lng: 8.5920 },
      { city: "Ibadan", state: "", lat: 7.3775, lng: 3.9470 },
    ],
    stdFmt("Nigeria"), () => String(randNum(100000, 999999))
  ),
  "Egypt": c("🇪🇬", "+20", "01# #### ####", "EET", "EGP (£)",
    ["Tahrir Square","26th of July Street","Qasr El Nil","Sharia Talaat Harb","Corniche El Nil"],
    [
      { city: "Cairo", state: "", lat: 30.0444, lng: 31.2357 },
      { city: "Alexandria", state: "", lat: 31.2001, lng: 29.9187 },
      { city: "Giza", state: "", lat: 30.0131, lng: 31.2089 },
    ],
    stdFmt("Egypt"), zip5
  ),
  "Kenya": c("🇰🇪", "+254", "07## ### ###", "EAT", "KES (KSh)",
    ["Kenyatta Avenue","Moi Avenue","Uhuru Highway","Kimathi Street","Tom Mboya Street"],
    [
      { city: "Nairobi", state: "", lat: -1.2921, lng: 36.8219 },
      { city: "Mombasa", state: "", lat: -4.0435, lng: 39.6682 },
    ],
    stdFmt("Kenya"), zip5
  ),
  "Ghana": c("🇬🇭", "+233", "024 ### ####", "GMT", "GHS (₵)",
    ["Oxford Street","Independence Avenue","Liberation Road","Ring Road Central"],
    [
      { city: "Accra", state: "", lat: 5.6037, lng: -0.1870 },
      { city: "Kumasi", state: "", lat: 6.6885, lng: -1.6244 },
    ],
    stdFmt("Ghana"), () => `${randChar()}${randChar()}-${randNum(100,999)}-${randNum(1000,9999)}`
  ),
  "Ethiopia": c("🇪🇹", "+251", "09## ### ###", "EAT", "ETB (Br)",
    ["Bole Road","Churchill Avenue","Meskel Square","Africa Avenue"],
    [
      { city: "Addis Ababa", state: "", lat: 9.0192, lng: 38.7525 },
      { city: "Dire Dawa", state: "", lat: 9.6009, lng: 41.8500 },
    ],
    stdFmt("Ethiopia"), zip4
  ),
  "Tanzania": c("🇹🇿", "+255", "07## ### ###", "EAT", "TZS (TSh)",
    ["Samora Avenue","Ali Hassan Mwinyi Road","Bagamoyo Road"],
    [{ city: "Dar es Salaam", state: "", lat: -6.7924, lng: 39.2083 }, { city: "Dodoma", state: "", lat: -6.1630, lng: 35.7516 }],
    stdFmt("Tanzania"), zip5
  ),
  "Uganda": c("🇺🇬", "+256", "07## ### ###", "EAT", "UGX (USh)",
    ["Kampala Road","Entebbe Road","Jinja Road"],
    [{ city: "Kampala", state: "", lat: 0.3476, lng: 32.5825 }],
    stdFmt("Uganda"), () => ""
  ),
  "Rwanda": c("🇷🇼", "+250", "07# ### ####", "CAT", "RWF (FRw)",
    ["KN 5 Avenue","KG 7 Avenue","Nyamirambo"],
    [{ city: "Kigali", state: "", lat: -1.9403, lng: 29.8739 }],
    stdFmt("Rwanda"), () => ""
  ),
  "Morocco": c("🇲🇦", "+212", "06## ######", "WET", "MAD (د.م.)",
    ["Avenue Mohammed V","Boulevard Zerktouni","Rue de la Liberté","Avenue Hassan II"],
    [
      { city: "Casablanca", state: "", lat: 33.5731, lng: -7.5898 },
      { city: "Marrakech", state: "", lat: 31.6295, lng: -7.9811 },
      { city: "Rabat", state: "", lat: 34.0209, lng: -6.8416 },
      { city: "Fez", state: "", lat: 34.0181, lng: -5.0078 },
    ],
    stdFmt("Morocco"), zip5
  ),
  "Tunisia": c("🇹🇳", "+216", "## ### ###", "CET", "TND (د.ت)",
    ["Avenue Habib Bourguiba","Rue de la Kasbah","Avenue de France"],
    [{ city: "Tunis", state: "", lat: 36.8065, lng: 10.1815 }],
    stdFmt("Tunisia"), zip4
  ),
  "Algeria": c("🇩🇿", "+213", "05## ## ## ##", "CET", "DZD (د.ج)",
    ["Rue Didouche Mourad","Boulevard Che Guevara","Rue Larbi Ben M'Hidi"],
    [{ city: "Algiers", state: "", lat: 36.7538, lng: 3.0588 }, { city: "Oran", state: "", lat: 35.6969, lng: -0.6331 }],
    stdFmt("Algeria"), zip5
  ),
  "Libya": c("🇱🇾", "+218", "09# ### ####", "EET", "LYD (ل.د)",
    ["Omar Al-Mukhtar Street","Green Square","Tripoli Street"],
    [{ city: "Tripoli", state: "", lat: 32.8872, lng: 13.1913 }],
    stdFmt("Libya"), () => ""
  ),
  "Sudan": c("🇸🇩", "+249", "09# ### ####", "CAT", "SDG (ج.س.)",
    ["Africa Street","Al-Qasr Street","Nile Avenue"],
    [{ city: "Khartoum", state: "", lat: 15.5007, lng: 32.5599 }],
    stdFmt("Sudan"), zip5
  ),
  "South Sudan": c("🇸🇸", "+211", "09# ### ####", "CAT", "SSP (£)",
    ["Juba Road","Custom Market Road"],
    [{ city: "Juba", state: "", lat: 4.8594, lng: 31.5713 }],
    stdFmt("South Sudan"), () => ""
  ),
  "Senegal": c("🇸🇳", "+221", "7# ### ## ##", "GMT", "XOF (CFA)",
    ["Avenue Cheikh Anta Diop","Rue de Thiong","Corniche Ouest"],
    [{ city: "Dakar", state: "", lat: 14.7167, lng: -17.4677 }],
    stdFmt("Senegal"), zip5
  ),
  "Ivory Coast": c("🇨🇮", "+225", "0# ## ## ## ##", "GMT", "XOF (CFA)",
    ["Boulevard de la République","Avenue Houphouët-Boigny"],
    [{ city: "Abidjan", state: "", lat: 5.3600, lng: -4.0083 }],
    stdFmt("Ivory Coast"), () => ""
  ),
  "Cameroon": c("🇨🇲", "+237", "6## ### ###", "WAT", "XAF (FCFA)",
    ["Boulevard du 20 Mai","Rue de Nachtigal"],
    [{ city: "Yaoundé", state: "", lat: 3.8480, lng: 11.5021 }, { city: "Douala", state: "", lat: 4.0511, lng: 9.7679 }],
    stdFmt("Cameroon"), () => ""
  ),
  "DR Congo": c("🇨🇩", "+243", "09# ### ####", "WAT/CAT", "CDF (FC)",
    ["Boulevard du 30 Juin","Avenue de la Libération"],
    [{ city: "Kinshasa", state: "", lat: -4.4419, lng: 15.2663 }, { city: "Lubumbashi", state: "", lat: -11.6876, lng: 27.5026 }],
    stdFmt("DR Congo"), () => ""
  ),
  "Angola": c("🇦🇴", "+244", "9## ### ###", "WAT", "AOA (Kz)",
    ["Rua Rainha Ginga","Marginal de Luanda"],
    [{ city: "Luanda", state: "", lat: -8.8390, lng: 13.2894 }],
    stdFmt("Angola"), () => ""
  ),
  "Mozambique": c("🇲🇿", "+258", "84 ### ####", "CAT", "MZN (MT)",
    ["Avenida Julius Nyerere","Avenida Eduardo Mondlane"],
    [{ city: "Maputo", state: "", lat: -25.9692, lng: 32.5732 }],
    stdFmt("Mozambique"), zip4
  ),
  "Zimbabwe": c("🇿🇼", "+263", "07# ### ####", "CAT", "ZWL ($)",
    ["Samora Machel Avenue","Julius Nyerere Way","Robert Mugabe Road"],
    [{ city: "Harare", state: "", lat: -17.8252, lng: 31.0335 }],
    stdFmt("Zimbabwe"), () => ""
  ),
  "Zambia": c("🇿🇲", "+260", "09# ### ####", "CAT", "ZMW (ZK)",
    ["Cairo Road","Great East Road","Independence Avenue"],
    [{ city: "Lusaka", state: "", lat: -15.3875, lng: 28.3228 }],
    stdFmt("Zambia"), zip5
  ),
  "Botswana": c("🇧🇼", "+267", "7# ### ###", "CAT", "BWP (P)",
    ["The Mall","Queen's Road","Khama Crescent"],
    [{ city: "Gaborone", state: "", lat: -24.6282, lng: 25.9231 }],
    stdFmt("Botswana"), () => ""
  ),
  "Namibia": c("🇳🇦", "+264", "081 ### ####", "CAT", "NAD ($)",
    ["Independence Avenue","Sam Nujoma Drive"],
    [{ city: "Windhoek", state: "", lat: -22.5609, lng: 17.0658 }],
    stdFmt("Namibia"), zip5
  ),
  "Madagascar": c("🇲🇬", "+261", "034 ## ### ##", "EAT", "MGA (Ar)",
    ["Avenue de l'Indépendance","Rue Rainitovo"],
    [{ city: "Antananarivo", state: "", lat: -18.8792, lng: 47.5079 }],
    stdFmt("Madagascar"), () => String(randNum(100, 999))
  ),
  "Mauritius": c("🇲🇺", "+230", "5### ####", "MUT", "MUR (₨)",
    ["Royal Road","St James Street","Caudan Waterfront"],
    [{ city: "Port Louis", state: "", lat: -20.1609, lng: 57.5012 }],
    stdFmt("Mauritius"), zip5
  ),
  "Seychelles": c("🇸🇨", "+248", "2 ## ## ##", "SCT", "SCR (₨)",
    ["Independence Avenue","Francis Rachel Street"],
    [{ city: "Victoria", state: "", lat: -4.6191, lng: 55.4513 }],
    stdFmt("Seychelles"), () => ""
  ),
  "Mali": c("🇲🇱", "+223", "## ## ## ##", "GMT", "XOF (CFA)",
    ["Avenue de l'Indépendance","Boulevard du Peuple"],
    [{ city: "Bamako", state: "", lat: 12.6392, lng: -8.0029 }],
    stdFmt("Mali"), () => ""
  ),
  "Burkina Faso": c("🇧🇫", "+226", "## ## ## ##", "GMT", "XOF (CFA)",
    ["Avenue de la Nation","Rue de la Chance"],
    [{ city: "Ouagadougou", state: "", lat: 12.3714, lng: -1.5197 }],
    stdFmt("Burkina Faso"), () => ""
  ),
  "Niger": c("🇳🇪", "+227", "## ## ## ##", "WAT", "XOF (CFA)",
    ["Avenue de l'Indépendance"],
    [{ city: "Niamey", state: "", lat: 13.5127, lng: 2.1128 }],
    stdFmt("Niger"), () => ""
  ),
  "Chad": c("🇹🇩", "+235", "## ## ## ##", "WAT", "XAF (FCFA)",
    ["Avenue Charles de Gaulle"],
    [{ city: "N'Djamena", state: "", lat: 12.1348, lng: 15.0557 }],
    stdFmt("Chad"), () => ""
  ),
  "Guinea": c("🇬🇳", "+224", "6## ## ## ##", "GMT", "GNF (FG)",
    ["Avenue de la République","Route de Donka"],
    [{ city: "Conakry", state: "", lat: 9.6412, lng: -13.5784 }],
    stdFmt("Guinea"), () => ""
  ),
  "Benin": c("🇧🇯", "+229", "## ## ## ##", "WAT", "XOF (CFA)",
    ["Boulevard de la Marina","Route de l'Aéroport"],
    [{ city: "Cotonou", state: "", lat: 6.3654, lng: 2.4183 }],
    stdFmt("Benin"), () => ""
  ),
  "Togo": c("🇹🇬", "+228", "9# ## ## ##", "GMT", "XOF (CFA)",
    ["Boulevard du 13 Janvier","Avenue de la Libération"],
    [{ city: "Lomé", state: "", lat: 6.1256, lng: 1.2254 }],
    stdFmt("Togo"), () => ""
  ),
  "Sierra Leone": c("🇸🇱", "+232", "076 ### ###", "GMT", "SLE (Le)",
    ["Siaka Stevens Street","Wilberforce Road"],
    [{ city: "Freetown", state: "", lat: 8.4657, lng: -13.2317 }],
    stdFmt("Sierra Leone"), () => ""
  ),
  "Liberia": c("🇱🇷", "+231", "077 ### ###", "GMT", "LRD ($)",
    ["Broad Street","Carey Street","Center Street"],
    [{ city: "Monrovia", state: "", lat: 6.2907, lng: -10.7605 }],
    stdFmt("Liberia"), zip4
  ),
  "Gambia": c("🇬🇲", "+220", "### ####", "GMT", "GMD (D)",
    ["Kairaba Avenue","Independence Drive"],
    [{ city: "Banjul", state: "", lat: 13.4549, lng: -16.5790 }],
    stdFmt("Gambia"), () => ""
  ),
  "Mauritania": c("🇲🇷", "+222", "## ## ## ##", "GMT", "MRU (UM)",
    ["Avenue Gamal Abdel Nasser","Avenue de l'Indépendance"],
    [{ city: "Nouakchott", state: "", lat: 18.0735, lng: -15.9582 }],
    stdFmt("Mauritania"), () => ""
  ),
  "Cape Verde": c("🇨🇻", "+238", "### ## ##", "CVT", "CVE ($)",
    ["Rua Pedonal","Avenida Amílcar Cabral"],
    [{ city: "Praia", state: "", lat: 14.9315, lng: -23.5133 }],
    stdFmt("Cape Verde"), zip4
  ),
  "São Tomé and Príncipe": c("🇸🇹", "+239", "9## ####", "GMT", "STN (Db)",
    ["Avenida da Independência"],
    [{ city: "São Tomé", state: "", lat: 0.3302, lng: 6.7332 }],
    stdFmt("São Tomé and Príncipe"), () => ""
  ),
  "Equatorial Guinea": c("🇬🇶", "+240", "### ### ###", "WAT", "XAF (FCFA)",
    ["Avenida de la Independencia"],
    [{ city: "Malabo", state: "", lat: 3.7504, lng: 8.7371 }],
    stdFmt("Equatorial Guinea"), () => ""
  ),
  "Gabon": c("🇬🇦", "+241", "## ## ## ##", "WAT", "XAF (FCFA)",
    ["Boulevard Triomphal","Avenue de l'Indépendance"],
    [{ city: "Libreville", state: "", lat: 0.4162, lng: 9.4673 }],
    stdFmt("Gabon"), () => ""
  ),
  "Republic of the Congo": c("🇨🇬", "+242", "## ### ####", "WAT", "XAF (FCFA)",
    ["Avenue de l'Indépendance"],
    [{ city: "Brazzaville", state: "", lat: -4.2634, lng: 15.2429 }],
    stdFmt("Republic of the Congo"), () => ""
  ),
  "Central African Republic": c("🇨🇫", "+236", "## ## ## ##", "WAT", "XAF (FCFA)",
    ["Avenue de l'Indépendance"],
    [{ city: "Bangui", state: "", lat: 4.3947, lng: 18.5582 }],
    stdFmt("Central African Republic"), () => ""
  ),
  "Eritrea": c("🇪🇷", "+291", "07 ### ###", "EAT", "ERN (Nfk)",
    ["Harnet Avenue","Sematat Avenue"],
    [{ city: "Asmara", state: "", lat: 15.3229, lng: 38.9251 }],
    stdFmt("Eritrea"), () => ""
  ),
  "Djibouti": c("🇩🇯", "+253", "77 ## ## ##", "EAT", "DJF (Fdj)",
    ["Boulevard de la République","Rue de Marseille"],
    [{ city: "Djibouti", state: "", lat: 11.5721, lng: 43.1456 }],
    stdFmt("Djibouti"), () => ""
  ),
  "Somalia": c("🇸🇴", "+252", "61 ### ####", "EAT", "SOS (Sh)",
    ["Maka Al-Mukarama Road","Via Roma"],
    [{ city: "Mogadishu", state: "", lat: 2.0469, lng: 45.3182 }],
    stdFmt("Somalia"), () => ""
  ),
  "Comoros": c("🇰🇲", "+269", "3## ## ##", "EAT", "KMF (CF)",
    ["Avenue de la République"],
    [{ city: "Moroni", state: "", lat: -11.7172, lng: 43.2473 }],
    stdFmt("Comoros"), () => ""
  ),
  "Malawi": c("🇲🇼", "+265", "09# ### ####", "CAT", "MWK (MK)",
    ["Victoria Avenue","Glyn Jones Road"],
    [{ city: "Lilongwe", state: "", lat: -13.9626, lng: 33.7741 }],
    stdFmt("Malawi"), () => ""
  ),
  "Lesotho": c("🇱🇸", "+266", "5### ####", "SAST", "LSL (L/M)",
    ["Kingsway","Main Road"],
    [{ city: "Maseru", state: "", lat: -29.3167, lng: 27.4833 }],
    stdFmt("Lesotho"), () => String(randNum(100, 999))
  ),
  "Eswatini": c("🇸🇿", "+268", "7### ####", "SAST", "SZL (E/L)",
    ["Gwamile Street","Allister Miller Street"],
    [{ city: "Mbabane", state: "", lat: -26.3054, lng: 31.1367 }],
    stdFmt("Eswatini"), () => `${randChar()}${randNum(100,999)}`
  ),
  "Burundi": c("🇧🇮", "+257", "7# ## ## ##", "CAT", "BIF (FBu)",
    ["Boulevard de l'Uprona","Avenue de l'Indépendance"],
    [{ city: "Bujumbura", state: "", lat: -3.3731, lng: 29.3644 }],
    stdFmt("Burundi"), () => ""
  ),

  // ──────── CARIBBEAN / ISLAND NATIONS ────────
  "Bahamas": c("🇧🇸", "+1-242", "###-####", "EST", "BSD ($)",
    ["Bay Street","Parliament Street","East Street"],
    [{ city: "Nassau", state: "", lat: 25.0343, lng: -77.3963 }],
    stdFmt("Bahamas"), () => ""
  ),
  "Barbados": c("🇧🇧", "+1-246", "###-####", "AST", "BBD ($)",
    ["Broad Street","Bay Street","Roebuck Street"],
    [{ city: "Bridgetown", state: "", lat: 13.1132, lng: -59.5988 }],
    stdFmt("Barbados"), () => `BB${randNum(10000,99999)}`
  ),
  "Belize": c("🇧🇿", "+501", "###-####", "CST", "BZD ($)",
    ["Albert Street","Regent Street","Queen Street"],
    [{ city: "Belize City", state: "", lat: 17.4985, lng: -88.1862 }],
    stdFmt("Belize"), () => ""
  ),
  "Grenada": c("🇬🇩", "+1-473", "###-####", "AST", "XCD ($)",
    ["Carenage","Church Street"],
    [{ city: "St. George's", state: "", lat: 12.0561, lng: -61.7488 }],
    stdFmt("Grenada"), () => ""
  ),
  "Saint Lucia": c("🇱🇨", "+1-758", "###-####", "AST", "XCD ($)",
    ["Bridge Street","Jeremie Street","Brazil Street"],
    [{ city: "Castries", state: "", lat: 14.0101, lng: -60.9875 }],
    stdFmt("Saint Lucia"), () => ""
  ),
  "Antigua and Barbuda": c("🇦🇬", "+1-268", "###-####", "AST", "XCD ($)",
    ["Long Street","Market Street","Redcliffe Street"],
    [{ city: "St. John's", state: "", lat: 17.1274, lng: -61.8468 }],
    stdFmt("Antigua and Barbuda"), () => ""
  ),
  "Saint Kitts and Nevis": c("🇰🇳", "+1-869", "###-####", "AST", "XCD ($)",
    ["Fort Street","Church Street"],
    [{ city: "Basseterre", state: "", lat: 17.3026, lng: -62.7177 }],
    stdFmt("Saint Kitts and Nevis"), () => ""
  ),
  "Dominica": c("🇩🇲", "+1-767", "###-####", "AST", "XCD ($)",
    ["Cork Street","King George V Street"],
    [{ city: "Roseau", state: "", lat: 15.3010, lng: -61.3881 }],
    stdFmt("Dominica"), () => ""
  ),
  "Saint Vincent": c("🇻🇨", "+1-784", "###-####", "AST", "XCD ($)",
    ["Bay Street","Halifax Street"],
    [{ city: "Kingstown", state: "", lat: 13.1587, lng: -61.2248 }],
    stdFmt("Saint Vincent"), () => ""
  ),
};

export type ContinentKey = "North America" | "South America" | "Europe" | "Middle East" | "South Asia" | "East Asia" | "Southeast Asia" | "Central Asia" | "Oceania" | "Africa" | "Caribbean";

export const continentCountries: Record<ContinentKey, string[]> = {
  "North America": ["United States", "Canada", "Mexico", "Cuba", "Jamaica", "Costa Rica", "Panama", "Guatemala", "Honduras", "Dominican Republic", "Trinidad and Tobago", "Haiti", "El Salvador", "Nicaragua"],
  "South America": ["Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Suriname", "Guyana"],
  "Europe": ["United Kingdom", "Germany", "France", "Italy", "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Iceland", "Ireland", "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Croatia", "Serbia", "Slovenia", "Bosnia and Herzegovina", "Montenegro", "North Macedonia", "Albania", "Kosovo", "Ukraine", "Belarus", "Moldova", "Lithuania", "Latvia", "Estonia", "Luxembourg", "Malta", "Cyprus", "Russia", "Georgia", "Armenia", "Azerbaijan"],
  "Middle East": ["Turkey", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Yemen", "Iraq", "Iran", "Jordan", "Lebanon", "Israel", "Palestine", "Syria"],
  "South Asia": ["India", "Bangladesh", "Pakistan", "Sri Lanka", "Nepal", "Bhutan", "Maldives", "Afghanistan"],
  "East Asia": ["Japan", "South Korea", "China", "Taiwan", "Hong Kong", "Mongolia", "North Korea"],
  "Southeast Asia": ["Thailand", "Vietnam", "Philippines", "Malaysia", "Singapore", "Indonesia", "Myanmar", "Cambodia", "Laos", "Brunei", "Timor-Leste"],
  "Central Asia": ["Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan"],
  "Oceania": ["Australia", "New Zealand", "Fiji", "Papua New Guinea", "Samoa", "Tonga", "Vanuatu", "Solomon Islands", "Micronesia", "Palau", "Marshall Islands", "Kiribati", "Tuvalu", "Nauru"],
  "Africa": ["South Africa", "Nigeria", "Egypt", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Uganda", "Rwanda", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan", "South Sudan", "Senegal", "Ivory Coast", "Cameroon", "DR Congo", "Angola", "Mozambique", "Zimbabwe", "Zambia", "Botswana", "Namibia", "Madagascar", "Mauritius", "Seychelles", "Mali", "Burkina Faso", "Niger", "Chad", "Guinea", "Benin", "Togo", "Sierra Leone", "Liberia", "Gambia", "Mauritania", "Cape Verde", "São Tomé and Príncipe", "Equatorial Guinea", "Gabon", "Republic of the Congo", "Central African Republic", "Eritrea", "Djibouti", "Somalia", "Comoros", "Malawi", "Lesotho", "Eswatini", "Burundi"],
  "Caribbean": ["Bahamas", "Barbados", "Belize", "Grenada", "Saint Lucia", "Antigua and Barbuda", "Saint Kitts and Nevis", "Dominica", "Saint Vincent"],
};

export const continentEmojis: Record<ContinentKey, string> = {
  "North America": "🌎",
  "South America": "🌎",
  "Europe": "🌍",
  "Middle East": "🌍",
  "South Asia": "🌏",
  "East Asia": "🌏",
  "Southeast Asia": "🌏",
  "Central Asia": "🌏",
  "Oceania": "🌏",
  "Africa": "🌍",
  "Caribbean": "🌎",
};
