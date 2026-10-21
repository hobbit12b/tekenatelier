# Verbeteringsronde tekenatelier

Ontwikkelbranch: `verbeteringen-kleuteratelier`. Datum: 21 oktober 2026.

## Resultaat en afbakening

De bestaande React/TypeScript-app is uitgebreid, zonder leeftijdsstanden. Alle zeven tekenmaterialen en alle aanvullende creatieve gereedschappen blijven direct bereikbaar. De indeling en krijtillustraties zijn behouden. De ontwikkelbranch wordt als pull request opgeleverd; de gepubliceerde main-versie verandert daarmee nog niet.

## Aanpassingen

- **Betrouwbare bewerkingen:** één actuele projectreferentie, functionele toevoegingen en oplopende revisies. Een vertraagde vulling of verplaatsing wordt alleen toegepast op de exacte oorspronkelijke momentopname. Twee snelle stickerplaatsingen behouden beide stickers. Een sticker die nog decodeert wordt niet meer in een inmiddels andere tekenbeurt geplaatst.
- **Opslag:** autosave blijft geserialiseerd; een oudere publieke revisie mag een nieuwere opgeslagen tekening niet overschrijven. Undo/redo krijgen een nieuwe revisie. Opslagfouten blijven zichtbaar; de succesafronding verschijnt pas na een geslaagde transactie.
- **Canvas:** pointerbewegingen worden per animatieframe gebundeld. Toegevoegde streken worden waar mogelijk op de bestaande tekening gerenderd. Tijdens objectverplaatsing wordt een aparte onderlaag hergebruikt. Pointercancel stopt het actieve gebaar. Touch-action en overscroll zijn begrensd rond de tekenbediening.
- **Vullen en geheugen:** de bestaande tolerantievulling draait in een Worker met overdracht van de pixelbuffer en een tijdslimiet. Kleine openingen blijven ondersteund. De gedecodeerde afbeeldingcache is begrensd op 32 MiB/24 entries, behalve één eventueel groter bronbeeld. Geschiedenis deelt onveranderde lagen; die worden niet per undo diep gekopieerd. Zeer veel unieke, complexe vulrasters kunnen nog steeds veel projectgeheugen innemen; er is bewust geen destructieve afvlakking van bewerkbare lagen.
- **Glitter:** geen animatielus zonder glitter en zonder gekozen glitterpen; verborgen tabbladen stoppen de animatielus en hervatten bij zichtbaarheid. De bestaande limiet op sterren en verminderde-beweginginstelling blijven bestaan.
- **Stickers:** 96 transparante illustraties zijn echt aanwezig: twaalf per thema. De loader maakt zelfstandige PNG’s, wacht op beelddecodering en importeert ieder ID eenmaal. Verwijdering, aangepaste naam en beschikbaarheid door de leerkracht worden gerespecteerd. Alle acht thema’s hebben een startcollectie. Zie `ILLUSTRATIES.md` voor 32 aanvullende beelden en de nog ontbrekende drukwerkmasters.
- **Objectbediening:** éénvingerslepen plus grote knoppen voor schalen, draaien, kopiëren en verwijderen. Schalen begrenst één gezamenlijke factor, zodat de verhouding ook bij de minimale/maximale maat blijft kloppen. Stempels blijven na plaatsing actief; voorbeeld en kleur blijven boven het blad zichtbaar. Een tik op een materiaal gaat terug naar vrij tekenen.
- **Zelfstandige bediening:** duidelijkere gekozen kleur en materiaal, visuele achtergrondstaaltjes, echte vormvoorbeelden, visuele uitleg voor één sticker tegenover herhaald stempelen. De belangrijkste knoppen zijn op drie tabletformaten geometrisch gecontroleerd.
- **Mengen:** twee verfkleuren bewegen samen naar één resultaat; daarna kan direct getekend worden. Geen punten, verplichte voorspelling of goed/fout-feedback. De vijf bestaande RYB-tests blijven gelden. Dit model leert primaire mengrelaties; het simuleert geen echte pigmenten, transparantie of complementaire verfmengsels nauwkeurig.
- **Afronden:** een grote fotovrije afbeelding van het kunstwerk met bewaarfeedback, museum, nieuw vel en verder tekenen. Technische bestandstypen staan alleen in de leerkrachtomgeving. PNG/JPG/PDF en delen zijn behouden; eerst voorbereiden, daarna een expliciete download/deeltik. ZIP blijft beschikbaar.
- **Gedeelde iPad:** optioneel herkenningsplaatje uit zes bestaande illustraties per project, met galerijfilters. Geen account, naam of leerlingnummer. Het is een geheugensteuntje, geen identiteit of toegangsbeveiliging; twee kinderen kunnen hetzelfde plaatje kiezen.
- **Extra gevonden fout:** ruitjes en stippen werden bij export achter de ondoorzichtige papierkleur getekend. De papierlaag wordt nu eerst volledig opgebouwd en daarna achter de tekening geplaatst.
- **Camera:** verouderde cameraverzoeken mogen geen later gekozen stream vervangen of na het sluiten opnieuw verschijnen. Bestaande encryptie, lokale fotolaag en fotovrije export zijn behouden.

## Vastgesteld met controles

- TypeScript en productiebuild.
- 26 Vitest-tests, waaronder zes nieuwe controles voor bewerkingsvolgorde, revisies, oude opslag en toegestane herkenningsplaatjes.
- 15 bestaande/aangepaste browsercontroles voor tekenen, vormen, autosave, heropenen, mengen, leerkracht, import, alle exportformaten en foto-privacy met uitsluitend fictieve data.
- Aanvullende browserreeks: twaalf stickers, snelle dubbele plaatsing, behouden verhouding na twaalf verkleiningen, gesimuleerde éénvingersleep, drie opeenvolgende stempels, doelbewust vertraagde Worker terwijl nieuw getekend wordt, achtergrondvoorbeelden, galerijfilter en blijvende bibliotheekverwijdering.
- Visuele inspectie op 1080 × 810 en 1024 × 768, aanvullende geometriecontrole op 1180 × 820. Hoofdknoppen minimaal 48 × 48 CSS-pixels, in beeld. Lijndiktes en kleuren hebben eigen grote klikvlakken; extra eigen kleuren kunnen binnen de paletgroep scrollen.
- Synthetische tekening met 500 streken van 80 punten opgebouwd. Dit bewijst renderbaarheid, geen framerate op iPad. De gemeten JS-tijd omvat niet noodzakelijk alle uitgestelde GPU-arbeid.
- Twintig verschillende vulachtige beelden geladen; de cache bleef op 8 beelden / 32.563.200 bytes onder 32 MiB. Dit is de cache, niet het totale tabgeheugen.
- Glitter: zichtbare frameverandering, undo en verminderde beweging.
- Productie onder `/tekenatelier/`: offline herladen, tekenen, sticker, Worker-vulling, mengen, opslaan, heropenen en PDF via de leerkracht.

De herhaalbare scripts staan in `scripts/`. GitHub-controle bouwt en voert unit-tests uit op de ontwikkelbranch en pull requests; de uitgebreide Edge-browsercontroles zijn lokaal uitgevoerd.

## Kritische beoordeling

Dit zijn voorlopige ontwerp-/techniekoordelen op een schaal van 10, **geen gemeten beoordeling door kinderen** en geen claim van 9,5. De scores geven onzekerheid en ontbrekende onderdelen nadrukkelijk gewicht.

| Onderdeel | Voorlopig | Onderbouwing en grens |
|---|---:|---|
| Zelfstandigheid | 8,5 | Pictogrammen, herhaalstempel, herkenningsplaatjes en kindafronding; zelfstandig begrip door vierjarigen nog niet onderzocht. |
| Vormgeving | 9,0 | Consistente krijtassets, warme papieromgeving en tabletcontrole; complete themacollectie ontbreekt. |
| Tekenplezier / mogelijkheden | 9,0 | Alle materialen, mengen, vormen, symmetrie, replay en stickers blijven beschikbaar; plezier is niet met gebruikers gemeten. |
| Educatieve meerwaarde | 8,5 | Vrij ontdekken zonder toetsing; menganimatie en vorm-/patroonfuncties. Volledig picturale verhaalopdrachten nog niet beschikbaar. |
| iPad-bediening | 8,0 | Touchsimulatie en drie vensterformaten slagen; Safari, palmcontact, fysieke ergonomie en native delen nog niet gevalideerd. |
| Betrouwbaarheid / prestaties | 8,5 | Async-races afgevangen, Worker, revisieopslag, cachelimiet en offline gecontroleerd; langdurig gebruik, geheugenplafond en OS-beëindiging vragen echte hardware. |
| Leerkrachtmogelijkheden | 8,5 | Thema’s, stickerbeheer, naamgeving, PNG/JPG/PDF/ZIP en aparte export; geen versleutelde projectbackup buiten browseropslag. |
| Privacy / veiligheid | 9,0 | Lokale verwerking, geen accounts/telemetrie, cryptografische fotoprojecten en fotovrije exports getest; geen externe beveiligingsaudit of bewijs van forensische verwijdering. |

Indicatief gemiddelde: **8,6/10**. Een onderbouwde 9,5 is met alleen code en browsersimulatie niet aantoonbaar.

## Tweede evaluatie en resterende zwakke punten

Na de eerste testreeks zijn de achtergrondexport, camera-requestrace en verhouding bij minimaal schalen verder aangescherpt. De herhaalde tests controleren die wijzigingen. De resterende grootste beperkingen zijn nu extern of inhoudelijk: aanvullende themabeelden en drukwerkmasters, echte iPad-prestaties en zelfstandig gebruik door kleuters. Deze worden niet met extra fictieve illustraties of een automatisch hoger cijfer verhuld.

## Korte praktijkproef (echte iPad 9)

Gebruik geen leerlingfoto’s of namen. Laat 3–5 kinderen uit groep 1 en 3–5 uit groep 2 ieder circa 15 minuten vrij ontdekken, met toestemming volgens het schoolbeleid. Observeer; geef pas hulp als het kind vastloopt.

1. Kan het kind zelfstandig een plaatje kiezen, een tekening beginnen en drie materialen vinden?
2. Kan het kind een kleur en lijndikte kiezen, een fout ongedaan maken en verdergaan?
3. Laat het kind een bijna gesloten cirkel vullen; let op respons en verwachtingen bij grotere openingen.
4. Kan het kind een sticker kiezen, met één vinger verplaatsen, groter maken en draaien?
5. Begrijpt het kind het verschil tussen één sticker en meerdere stempelafdrukken?
6. Laat twee kleuren vrij mengen. Vraag vrijblijvend wat het kind ziet, zonder een antwoord af te dwingen.
7. Kan het kind zijn werk afronden en later via het herkenningsplaatje terugvinden? Test ook gedeelde plaatjes.
8. Controleer of vingers/palm, thuisswipe, paginazoom, een tweede vinger en liggend/staand wisselen onbedoelde acties veroorzaken.
9. Leerkracht: test Safari én beginscherm-PWA, camera voor/achter met een voorwerp, geweigerde toestemming, PDF/deelmenu/Bestanden en printer.
10. Test vliegtuigmodus, opnieuw starten, 500+ streken, veel vullingen/glitter en weinig vrije opslag. Controleer opgeslagen werk na geforceerd afsluiten; noteer wat niet kan worden gegarandeerd.

Registreer tijd tot eerste tekening, aantal benodigde hulpinterventies, gemiste tikken, teruggevonden kunstwerken en technische fouten. Streef naar geen dataverlies en zelfstandig voltooien van de kernhandelingen bij ten minste 80% van de kinderen in deze eerste kleine proef; behandel dit als ontwikkelcriterium, niet als wetenschappelijk bewijs. Verbeter op basis van observaties voordat een definitieve score wordt gegeven.

## Aanvulling: acht stickercollecties

Zeven nieuwe transparante stickervellen voegen 84 illustraties toe. Elk van de acht thema’s heeft nu twaalf stickers. De leerkracht bepaalt welke thema’s zichtbaar zijn; bestaande keuzes en verwijderingen blijven behouden. De inventarisgenerator controleert nu combinaties van thema en naam, zodat een sneeuwpop bij kerst niet ten onrechte als winterillustratie wordt meegeteld. De voorlopige beoordeling blijft 8,6: gebruiksonderzoek en fysieke iPad-tests zijn nog niet uitgevoerd.

Validatie van deze aanvulling: TypeScript en productiebuild geslaagd; acht collecties met ieder twaalf gedecodeerde transparante afbeeldingen gecontroleerd en visueel bekeken. De uitgebreide browserproef slaagt met 96 stickers, snelle plaatsing, schalen, touch, vullen, bewaren en blijvende verwijdering. De productie-offlineproef slaagt met alle acht atlasbestanden, heropenen en PDF-export; de cache bevat 28 algemene appbestanden.
