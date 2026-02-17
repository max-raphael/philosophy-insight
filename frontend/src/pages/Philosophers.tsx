import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../components/ThemeToggle'
import { getPhilosophersFromTexts, eras, type EraId } from '../data/collections'

interface TextInfo {
  id: string
  title: string
  author: string
  description?: string
  year?: string
  category?: string
}

interface PhilosophersProps {
  texts: TextInfo[]
  onOpenSearch: (author?: string) => void
}

// Philosopher portraits (from Wikipedia API)
const philosopherImages: Record<string, string> = {
  // Ancient
  'Plato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/440px-Plato_Silanion_Musei_Capitolini_MC1377.jpg',
  'Aristotle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/440px-Aristotle_Altemps_Inv8575.jpg',
  'Cicero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bust_of_Cicero_%281st-cent._BC%29_-_Palazzo_Nuovo_-_Musei_Capitolini_-_Rome_2016.jpg/440px-Bust_of_Cicero_%281st-cent._BC%29_-_Palazzo_Nuovo_-_Musei_Capitolini_-_Rome_2016.jpg',
  'Seneca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Duble_herma_of_Socrates_and_Seneca_Antikensammlung_Berlin_07.jpg/440px-Duble_herma_of_Socrates_and_Seneca_Antikensammlung_Berlin_07.jpg',
  'Marcus Aurelius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/MSR-ra-61-b-1-DM.jpg/440px-MSR-ra-61-b-1-DM.jpg',
  'Epictetus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Epicteti_Enchiridion_Latinis_versibus_adumbratum_%28Oxford_1715%29_frontispiece.jpg/440px-Epicteti_Enchiridion_Latinis_versibus_adumbratum_%28Oxford_1715%29_frontispiece.jpg',
  'Plotinus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Plotinos.jpg/440px-Plotinos.jpg',
  'Plutarch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Portrait_of_a_philosopher%2C_maybe_Plutarch%2C_2nd_century_BC%2C_AM_Delphi%2C_0135.jpg/440px-Portrait_of_a_philosopher%2C_maybe_Plutarch%2C_2nd_century_BC%2C_AM_Delphi%2C_0135.jpg',
  'Proclus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/In_primum_Euclidis_elementorum_librum_01.jpg/440px-In_primum_Euclidis_elementorum_librum_01.jpg',
  'Iamblichus': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Iamblichus.jpg',
  // Medieval
  'Augustine of Hippo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Saint_Augustine_by_Philippe_de_Champaigne.jpg/440px-Saint_Augustine_by_Philippe_de_Champaigne.jpg',
  'Thomas Aquinas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/St-thomas-aquinas.jpg/440px-St-thomas-aquinas.jpg',
  'Boethius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Boethius_initial_consolance_philosophy.jpg/440px-Boethius_initial_consolance_philosophy.jpg',
  // Renaissance
  'Niccolò Machiavelli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg/440px-Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg',
  'Desiderius Erasmus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Holbein-erasmus.jpg/440px-Holbein-erasmus.jpg',
  'Giordano Bruno': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Portrait_of_Giordano_Bruno_in_%22Opere%22_Wellcome_L0015152_%28cropped%29.jpg/440px-Portrait_of_Giordano_Bruno_in_%22Opere%22_Wellcome_L0015152_%28cropped%29.jpg',
  'Francis Bacon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Somer_Francis_Bacon.jpg/440px-Somer_Francis_Bacon.jpg',
  // Enlightenment
  'René Descartes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg/440px-Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg',
  'Baruch Spinoza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Spinoza.jpg/440px-Spinoza.jpg',
  'John Locke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/JohnLocke.png/440px-JohnLocke.png',
  'Gottfried Wilhelm Leibniz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Christoph_Bernhard_Francke_-_Bildnis_des_Philosophen_Leibniz_%28ca._1695%29.jpg/440px-Christoph_Bernhard_Francke_-_Bildnis_des_Philosophen_Leibniz_%28ca._1695%29.jpg',
  'David Hume': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Painting_of_David_Hume.jpg/440px-Painting_of_David_Hume.jpg',
  'Immanuel Kant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Immanuel_Kant_%28painted_portrait%29.jpg/440px-Immanuel_Kant_%28painted_portrait%29.jpg',
  'Jean-Jacques Rousseau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_WGA12360.jpg/440px-Maurice_Quentin_de_La_Tour_-_Portrait_of_Jean-Jacques_Rousseau_-_WGA12360.jpg',
  'Voltaire': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/D%27apr%C3%A8s_Maurice_Quentin_de_La_Tour%2C_Portrait_de_Voltaire%2C_d%C3%A9tail_du_visage_%28ch%C3%A2teau_de_Ferney%29_-002.jpg/440px-D%27apr%C3%A8s_Maurice_Quentin_de_La_Tour%2C_Portrait_de_Voltaire%2C_d%C3%A9tail_du_visage_%28ch%C3%A2teau_de_Ferney%29_-002.jpg',
  'George Berkeley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/George_Berkeley_by_John_Smibert.jpg/440px-George_Berkeley_by_John_Smibert.jpg',
  'Edmund Burke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sir_Joshua_Reynolds_-_Edmund_Burke%2C_1729_-_1797._Statesman%2C_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland.jpg/440px-Sir_Joshua_Reynolds_-_Edmund_Burke%2C_1729_-_1797._Statesman%2C_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland.jpg',
  'Thomas Paine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Laurent_Dabos_%E2%80%93_Thomas_Paine_%E2%80%93_Google_Art_Project.jpg/440px-Laurent_Dabos_%E2%80%93_Thomas_Paine_%E2%80%93_Google_Art_Project.jpg',
  'Blaise Pascal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Blaise_Pascal_Versailles.JPG/440px-Blaise_Pascal_Versailles.JPG',
  // 19th Century
  'Georg Wilhelm Friedrich Hegel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Hegel_portrait_by_Schlesinger_1831.jpg/440px-Hegel_portrait_by_Schlesinger_1831.jpg',
  'G. W. F. Hegel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Jakob_Schlesinger_-_Hegel_1831.jpg/440px-Jakob_Schlesinger_-_Hegel_1831.jpg',
  'Friedrich Nietzsche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/440px-Nietzsche187a.jpg',
  'John Stuart Mill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg/440px-John_Stuart_Mill_by_London_Stereoscopic_Company%2C_c1870.jpg',
  'Arthur Schopenhauer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Arthur_Schopenhauer_by_J_Sch%C3%A4fer%2C_1859b.jpg/440px-Arthur_Schopenhauer_by_J_Sch%C3%A4fer%2C_1859b.jpg',
  'Herbert Spencer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Herbert_Spencer.jpg/440px-Herbert_Spencer.jpg',
  'Thomas Carlyle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Thomas_Carlyle_lm.jpg/440px-Thomas_Carlyle_lm.jpg',
  'Henry David Thoreau': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Benjamin_D._Maxham_-_Henry_David_Thoreau_-_Restored.jpg/440px-Benjamin_D._Maxham_-_Henry_David_Thoreau_-_Restored.jpg',
  'Ralph Waldo Emerson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Ralph_Waldo_Emerson_ca1857_retouched.jpg/440px-Ralph_Waldo_Emerson_ca1857_retouched.jpg',
  'Søren Kierkegaard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kierkegaard.jpg/440px-Kierkegaard.jpg',
  'Friedrich Schlegel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Franz_Gareis_Portrait_Friedrich_Schlegel.jpg/440px-Franz_Gareis_Portrait_Friedrich_Schlegel.jpg',
  'Thomas Henry Huxley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Thomas_Henry_Huxley._Photograph_by_Lock_%26_Whitfield._Wellcome_V0026596.jpg/440px-Thomas_Henry_Huxley._Photograph_by_Lock_%26_Whitfield._Wellcome_V0026596.jpg',
  'William Whewell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Portrait_of_W._Whewell%3B_stipple_engraving_Wellcome_L0014766.jpg/440px-Portrait_of_W._Whewell%3B_stipple_engraving_Wellcome_L0014766.jpg',
  'Walter Pater': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Walter-pater-1.jpg',
  'Matthew Arnold': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Matthew_Arnold.jpg/440px-Matthew_Arnold.jpg',
  'Pierre-Joseph Proudhon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Portrait_of_Pierre_Joseph_Proudhon_1865.jpg/440px-Portrait_of_Pierre_Joseph_Proudhon_1865.jpg',
  // 20th Century
  'Bertrand Russell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Bertrand_Russell_smoking_in_1936.jpg/440px-Bertrand_Russell_smoking_in_1936.jpg',
  'John Dewey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/John_Dewey_cph.3a51565.jpg/440px-John_Dewey_cph.3a51565.jpg',
  'William James': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/William_James_b1842c.jpg/440px-William_James_b1842c.jpg',
  'George Santayana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/George_Santayana.jpg/440px-George_Santayana.jpg',
  'Henri Bergson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Henri_Bergson_02.jpg/440px-Henri_Bergson_02.jpg',
  'Alfred North Whitehead': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/ANWhitehead.jpg',
  'Benedetto Croce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Benedetto_Croce_01.jpg/440px-Benedetto_Croce_01.jpg',
  'G. E. Moore': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/1914_George_Edward_Moore_%28cropped%29.jpg',
  'Wilhelm Wundt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Wilhelm_Wundt.jpg/440px-Wilhelm_Wundt.jpg',
  'Georg Lukács': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Luk%C3%A1cs_Gy%C3%B6rgy.jpg',
  'Mahatma Gandhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/440px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
  // Eastern - Chinese
  'Confucius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Confucius_Tang_Dynasty.jpg/440px-Confucius_Tang_Dynasty.jpg',
  'Laozi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Zhang_Lu-Laozi_Riding_an_Ox.jpg/440px-Zhang_Lu-Laozi_Riding_an_Ox.jpg',
  'Zhuangzi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Dschuang-Dsi-Schmetterlingstraum-Zhuangzi-Butterfly-Dream.jpg/440px-Dschuang-Dsi-Schmetterlingstraum-Zhuangzi-Butterfly-Dream.jpg',
  'Wang Yangming': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/%E7%8E%8B%E5%AE%88%E4%BB%81.jpg/440px-%E7%8E%8B%E5%AE%88%E4%BB%81.jpg',
  // Eastern - Indian
  'Vyasa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sculpture_of_Vyasa.jpeg/440px-Sculpture_of_Vyasa.jpeg',
  'Rabindranath Tagore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/1926_Rabindrath_Tagore.jpg/440px-1926_Rabindrath_Tagore.jpg',
  'Swami Vivekananda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Swami_Vivekananda-1893-09-signed.jpg/440px-Swami_Vivekananda-1893-09-signed.jpg',
  'Kalidasa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kalidasa_inditing_the_cloud_Messenger%2C_A.D._375.jpg/440px-Kalidasa_inditing_the_cloud_Messenger%2C_A.D._375.jpg',
  'Buddha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/440px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg',
  // Sufi & Persian
  'Omar Khayyam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hakim_Omar_Khayam_-_panoramio.jpg/440px-Hakim_Omar_Khayam_-_panoramio.jpg',
  'Rumi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mevlana_Konya.jpg/440px-Mevlana_Konya.jpg',
  'Jalal al-Din Rumi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/%D9%85%D9%88%D9%84%D8%A7%D9%86%D8%A7_%D8%A7%D8%AB%D8%B1_%D8%AD%D8%B3%DB%8C%D9%86_%D8%A8%D9%87%D8%B2%D8%A7%D8%AF_%28cropped%29.jpg/440px-%D9%85%D9%88%D9%84%D8%A7%D9%86%D8%A7_%D8%A7%D8%AB%D8%B1_%D8%AD%D8%B3%DB%8C%D9%86_%D8%A8%D9%87%D8%B2%D8%A7%D8%AF_%28cropped%29.jpg',
  'Hafiz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Divan_hafiz.jpg/450px-Divan_hafiz.jpg',
  'Ibn Tufail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Ibn_%E1%B9%ACufail%2C_Sayr_mulhimah_min_al-Sharq_wa-al-Gharb.png/440px-Ibn_%E1%B9%ACufail%2C_Sayr_mulhimah_min_al-Sharq_wa-al-Gharb.png',
  // Revolutionary
  'Karl Marx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Karl_Marx_001.jpg/440px-Karl_Marx_001.jpg',
  'Friedrich Engels': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Friedrich_Engels_portrait_%28cropped%29.jpg/440px-Friedrich_Engels_portrait_%28cropped%29.jpg',
  'Vladimir Lenin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Lenin_CL.jpg/440px-Lenin_CL.jpg',
  'Rosa Luxemburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Rosa_Luxemburg.jpg/440px-Rosa_Luxemburg.jpg',
  'Leon Trotsky': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Лев_Троцкий.jpg/440px-Лев_Троцкий.jpg',
  'Peter Kropotkin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Peter_Kropotkin_circa_1900.jpg/440px-Peter_Kropotkin_circa_1900.jpg',
  'Mikhail Bakunin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Mikhail_Bakunin.jpg/440px-Mikhail_Bakunin.jpg',
  'Emma Goldman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Emma_Goldman_seated.jpg/440px-Emma_Goldman_seated.jpg',
  'Antonio Gramsci': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gramsci.png/440px-Gramsci.png',
  'Errico Malatesta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Malatesta_1891.png/440px-Malatesta_1891.png',
  'Max Stirner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Max_Stirner-k.svg/440px-Max_Stirner-k.svg.png',
  // Enlightenment additions
  "Baron d'Holbach": 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Paul_Heinrich_Dietrich_Baron_d%27Holbach_Roslin.jpg/440px-Paul_Heinrich_Dietrich_Baron_d%27Holbach_Roslin.jpg',
  'Adam Smith': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Adam_Smith_The_Muir_portrait.jpg/440px-Adam_Smith_The_Muir_portrait.jpg',
  'Denis Diderot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Denis_Diderot_by_Louis-Michel_van_Loo.jpg/440px-Denis_Diderot_by_Louis-Michel_van_Loo.jpg',
  'Julien Offray de La Mettrie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Julien_Offray_de_La_Mettrie.jpg/440px-Julien_Offray_de_La_Mettrie.jpg',
  'Jean de La Bruyère': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Jean_de_la_Bruy%C3%A8re_-_Versailles_MV_2940.png/440px-Jean_de_la_Bruy%C3%A8re_-_Versailles_MV_2940.png',
  'François de La Rochefoucauld': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Fran%C3%A7ois_de_La_Rochefoucauld.jpg/440px-Fran%C3%A7ois_de_La_Rochefoucauld.jpg',
  'Gotthold Ephraim Lessing': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Gotthold_Ephraim_Lessing.PNG',
  'Friedrich Schiller': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Anton_Graff_-_Friedrich_Schiller.jpg/440px-Anton_Graff_-_Friedrich_Schiller.jpg',
  'Michel de Montaigne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Portrait_of_Michel_de_Montaigne%2C_circa_unknown.jpg/440px-Portrait_of_Michel_de_Montaigne%2C_circa_unknown.jpg',
  'Thomas Hobbes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Thomas_Hobbes_by_John_Michael_Wright_%28colour%29_%283x4_cropped%29.jpg/440px-Thomas_Hobbes_by_John_Michael_Wright_%28colour%29_%283x4_cropped%29.jpg',
  'Thomas More': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Hans_Holbein%2C_the_Younger_-_Sir_Thomas_More_-_Google_Art_Project.jpg/440px-Hans_Holbein%2C_the_Younger_-_Sir_Thomas_More_-_Google_Art_Project.jpg',
  'Jeremy Bentham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Jeremy_Bentham_by_Henry_William_Pickersgill.jpg/440px-Jeremy_Bentham_by_Henry_William_Pickersgill.jpg',
  'Mary Wollstonecraft': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mary_Wollstonecraft_by_John_Opie_%28c._1797%29.jpg/440px-Mary_Wollstonecraft_by_John_Opie_%28c._1797%29.jpg',
  'William Godwin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/William_Godwin_by_Henry_William_Pickersgill.jpg/440px-William_Godwin_by_Henry_William_Pickersgill.jpg',
  // 19th Century additions
  'Alexis de Tocqueville': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Alexis_de_Tocqueville_%28Th%C3%A9odore_Chass%C3%A9riau_-_Versailles%29.jpg/440px-Alexis_de_Tocqueville_%28Th%C3%A9odore_Chass%C3%A9riau_-_Versailles%29.jpg',
  'Auguste Comte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Auguste_Comte.jpg/440px-Auguste_Comte.jpg',
  'Ludwig Feuerbach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Ludwig_Feuerbach-1.2_V01-1.1.1_cropped_and_rotated.jpg/440px-Ludwig_Feuerbach-1.2_V01-1.1.1_cropped_and_rotated.jpg',
  'John Ruskin': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/John_Ruskin_1863.jpg',
  'John Henry Newman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Photo_of_John_Henry_Newman.jpg/440px-Photo_of_John_Henry_Newman.jpg',
  'William Hazlitt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/William_Hazlitt_self-portrait_%281802%29.jpg/440px-William_Hazlitt_self-portrait_%281802%29.jpg',
  'Leo Tolstoy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Leo_Tolstoy_1908_Portrait_%283x4_cropped%29.jpg/440px-Leo_Tolstoy_1908_Portrait_%283x4_cropped%29.jpg',
  'Harriet Taylor Mill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Harriet_Mill_from_NPG.jpg/440px-Harriet_Mill_from_NPG.jpg',
  // 20th Century additions
  'Ludwig Wittgenstein': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ludwig_Wittgenstein_1929.jpg/440px-Ludwig_Wittgenstein_1929.jpg',
  'Charles Sanders Peirce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Charles_Sanders_Peirce.png/440px-Charles_Sanders_Peirce.png',
  'Josiah Royce': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Josiah_Royce.jpeg/440px-Josiah_Royce.jpeg',
  'Bernard Bosanquet': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/BernardBosanquetPhilosopher.jpg',
  'Franz Brentano': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Franz_Brentano_in_Vienna%2C_1890.png/440px-Franz_Brentano_in_Vienna%2C_1890.png',
  'Henry Sidgwick': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Henry_Sidgwick_National_Portrait_Gallery_headshot_crop.png/440px-Henry_Sidgwick_National_Portrait_Gallery_headshot_crop.png',
  'Henri Poincaré': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PSM_V82_D416_Henri_Poincare.png/440px-PSM_V82_D416_Henri_Poincare.png',
  'Gustave Le Bon': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Picture_of_Le_Bon.jpg',
  'Thorstein Veblen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Veblen3a.jpg/440px-Veblen3a.jpg',
  'Jane Addams': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jane_Addams_-_Bain_News_Service.jpg/440px-Jane_Addams_-_Bain_News_Service.jpg',
  'Charlotte Perkins Gilman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Charlotte_Perkins_Gilman_c._1900.jpg/440px-Charlotte_Perkins_Gilman_c._1900.jpg',
  // Ancient additions
  'Lucretius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Lucretius_pointing_to_the_casus.jpg/440px-Lucretius_pointing_to_the_casus.jpg',
  'Xenophon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bust_of_Xenophon.jpg/440px-Bust_of_Xenophon.jpg',
  // Eastern additions
  'Mencius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_-_Meng_Ke_%28%E5%AD%9F%E8%BB%BB%29.jpg/440px-Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_-_Meng_Ke_%28%E5%AD%9F%E8%BB%BB%29.jpg',
  'Han Feizi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Statue_Of_Han_Fei.png/440px-Statue_Of_Han_Fei.png',
  'Sun Tzu': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/%E5%90%B4%E5%8F%B8%E9%A9%AC%E5%AD%99%E6%AD%A6.jpg',
  'D. T. Suzuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Daisetsu_Teitar%C5%8D_Suzuki_photographed_by_Shigeru_Tamura.jpg/440px-Daisetsu_Teitar%C5%8D_Suzuki_photographed_by_Shigeru_Tamura.jpg',
  // Islamic additions
  'Averroes (Ibn Rushd)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Andrea_di_bonaiuto%2C_apotesosi_di_san_tommaso_d%27aquino%2C_11_averro%C3%A8.jpg/440px-Andrea_di_bonaiuto%2C_apotesosi_di_san_tommaso_d%27aquino%2C_11_averro%C3%A8.jpg',
  'Avicenna (Ibn Sina)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Avicenna_Bust%2C_left_profile_%28cropped%29.jpg/440px-Avicenna_Bust%2C_left_profile_%28cropped%29.jpg',
  'Moses Maimonides': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Portrait_of_Moses_Maimonides_in_Thesaurus_antiquitatum_sacrarum.tif/lossy-page1-440px-Portrait_of_Moses_Maimonides_in_Thesaurus_antiquitatum_sacrarum.tif.jpg',
  // More Eastern
  'Mozi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/%D0%A4%D0%B8%D0%BB%D0%BE%D1%81%D0%BE%D1%84_%D0%9C%D0%BE-%D0%A6%D0%B7%D1%8B.jpg/440px-%D0%A4%D0%B8%D0%BB%D0%BE%D1%81%D0%BE%D1%84_%D0%9C%D0%BE-%D0%A6%D0%B7%D1%8B.jpg',
  'Liezi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Brooklyn_Museum_-_Calligraphy_Lieh_Tzu_Yang-chu_Chapter_-_Kojima_Soshin.jpg/440px-Brooklyn_Museum_-_Calligraphy_Lieh_Tzu_Yang-chu_Chapter_-_Kojima_Soshin.jpg',
  'Lao Tzu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Laozi_%28Chinese_characters%29.svg/440px-Laozi_%28Chinese_characters%29.svg.png',
  'Kabir': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Kabir004.jpg',
  'Patanjali': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Pata%C3%B1jali11.JPG',
  'Valmiki': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Valmiki_Ramayana.jpg',
  // Additional
  'Pythagoras': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pythagoras_in_the_Roman_Forum%2C_Colosseum.jpg/440px-Pythagoras_in_the_Roman_Forum%2C_Colosseum.jpg',
  'Adam Ferguson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/ProfAdamFerguson.jpg/440px-ProfAdamFerguson.jpg',
  'Lafcadio Hearn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lafcadio_Hearn_portrait.jpg/440px-Lafcadio_Hearn_portrait.jpg',
  'John Herschel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sir_John_Frederick_William_Herschel._Mezzotint_by_W._Ward%2C_1_Wellcome_V0002717_%28cropped%29-34-%28brightness%29.jpg/440px-Sir_John_Frederick_William_Herschel._Mezzotint_by_W._Ward%2C_1_Wellcome_V0002717_%28cropped%29-34-%28brightness%29.jpg',
  'R.H. Tawney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/R._H._Tawney.png/440px-R._H._Tawney.png',
  'Mary Parker Follett': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Mary_Parker_Follett.jpg',
  'Jean Meslier': 'https://upload.wikimedia.org/wikipedia/commons/6/66/J._Meslier_%28gravure_1802%29.jpg',
  'Arthur Waley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Arthur_Waley_by_Ray_Strachey.jpg/440px-Arthur_Waley_by_Ray_Strachey.jpg',
  'Badarayana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sculpture_of_Vyasa.jpeg/440px-Sculpture_of_Vyasa.jpeg',
  'Jean Grave': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Jean_Grave.png',
  'Mary Mills Patrick': 'https://upload.wikimedia.org/wikipedia/commons/3/31/MaryMillsPatrick1894.jpg',
  'Shinran Shonin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Shinran_%28Nara_National_Museum%29.jpg/440px-Shinran_%28Nara_National_Museum%29.jpg',
  'Surendranath Dasgupta': 'https://upload.wikimedia.org/wikipedia/commons/9/97/Surendranath_Dasgupta.jpg',
  'Zengzi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_-_Zeng_Shen_Ziyu_%28%E6%9B%BE%E5%8F%83_%E5%AD%90%E8%BC%BF%29.jpg/440px-Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_-_Zeng_Shen_Ziyu_%28%E6%9B%BE%E5%8F%83_%E5%AD%90%E8%BC%BF%29.jpg',
  'Anna Julia Cooper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/A_J_Cooper.jpg/440px-A_J_Cooper.jpg',
  'Porphyry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Portrait_of_Porphyry_of_Tyre_from_Les_vrais_pourtraits_et_vies_des_hommes_illustres_grecz%2C_latins_et_payens.jpg/440px-Portrait_of_Porphyry_of_Tyre_from_Les_vrais_pourtraits_et_vies_des_hommes_illustres_grecz%2C_latins_et_payens.jpg',
  'L.T. Hobhouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Leonard_Trelawny_Hobhouse%2C_c1910.jpg/440px-Leonard_Trelawny_Hobhouse%2C_c1910.jpg',
  'Xunzi': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Xun_zi.jpg',
  'Al-Ghazali': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Al-Risala_Al-Ladunniyya.png',
  'Diogenes Laertius': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Diogenes_Laertius.jpg',
  'Diogenes Laërtius': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Diogenes_Laertius.jpg',
  'Kaiten Nukariya': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Kaiten_Nukariya.jpg',
}

// Category labels
const categoryLabels: Record<string, string> = {
  ancient: 'Ancient',
  medieval: 'Medieval',
  enlightenment: 'Enlightenment',
  modern: 'Modern',
  chinese: 'Chinese',
  indian: 'Indian',
  buddhist: 'Buddhist',
  sufi: 'Sufi & Persian',
  marxist: 'Revolutionary',
}

// Category color mapping
const categoryStyles: Record<string, { bg: string; text: string }> = {
  ancient: { bg: 'bg-[var(--category-ancient-bg)]', text: 'text-[var(--category-ancient-text)]' },
  medieval: { bg: 'bg-[var(--category-medieval-bg)]', text: 'text-[var(--category-medieval-text)]' },
  enlightenment: { bg: 'bg-[var(--category-enlightenment-bg)]', text: 'text-[var(--category-enlightenment-text)]' },
  modern: { bg: 'bg-[var(--category-modern-bg)]', text: 'text-[var(--category-modern-text)]' },
  chinese: { bg: 'bg-[var(--category-chinese-bg)]', text: 'text-[var(--category-chinese-text)]' },
  indian: { bg: 'bg-[var(--category-indian-bg)]', text: 'text-[var(--category-indian-text)]' },
  buddhist: { bg: 'bg-[var(--category-buddhist-bg)]', text: 'text-[var(--category-buddhist-text)]' },
  sufi: { bg: 'bg-[var(--category-sufi-bg)]', text: 'text-[var(--category-sufi-text)]' },
  marxist: { bg: 'bg-[var(--category-marxist-bg)]', text: 'text-[var(--category-marxist-text)]' },
}

type FilterCategory = EraId | 'all'

interface Philosopher {
  name: string
  textIds: string[]
  category: string
}

export default function Philosophers({ texts, onOpenSearch }: PhilosophersProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // Get all philosophers from texts
  const philosophers = useMemo(() => {
    return getPhilosophersFromTexts(texts)
  }, [texts])

  // Filter philosophers by category
  const filteredPhilosophers = useMemo(() => {
    if (filterCategory === 'all') return philosophers
    return philosophers.filter(p => p.category === filterCategory)
  }, [philosophers, filterCategory])

  // Get texts for a philosopher
  const getPhilosopherTexts = (textIds: string[]) => {
    return texts.filter(t => textIds.includes(t.id))
  }

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhilosopher(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPhilosopher) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedPhilosopher])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-primary)]/50 rounded-full px-6 py-3 shadow-lg">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-display text-lg font-medium text-[var(--text-primary)] tracking-tight">Philosophy Insight</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onOpenSearch()}
                className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-ui"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-ui mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Library
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4">
              Philosophers
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-body max-w-2xl">
              {filteredPhilosophers.length} thinkers across {eras.length} traditions, spanning 2,500 years of human thought.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                  filterCategory === 'all'
                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                }`}
              >
                All
              </button>
              {eras.map(era => (
                <button
                  key={era.id}
                  onClick={() => setFilterCategory(era.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-all font-ui ${
                    filterCategory === era.id
                      ? 'bg-[var(--accent-primary)] text-[var(--text-inverted)]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Philosopher Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredPhilosophers.map((philosopher, i) => {
              const imageUrl = philosopherImages[philosopher.name]
              const style = categoryStyles[philosopher.category] || categoryStyles.ancient

              return (
                <motion.button
                  key={philosopher.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  onClick={() => setSelectedPhilosopher(philosopher)}
                  className="text-left group"
                >
                  {/* Avatar */}
                  <div className="relative w-full aspect-square mb-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden group-hover:border-[var(--accent-primary)]/50 transition-all duration-300">
                    {imageUrl && !failedImages.has(philosopher.name) ? (
                      <img
                        src={imageUrl}
                        alt={philosopher.name}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        onError={() => setFailedImages(prev => new Set(prev).add(philosopher.name))}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-5xl text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                          {philosopher.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-ui ${style.bg} ${style.text}`}>
                      {categoryLabels[philosopher.category] || 'Unknown'}
                    </div>

                    {/* Work count badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-full">
                      <span className="text-[10px] font-ui text-[var(--text-muted)]">
                        {philosopher.textIds.length} {philosopher.textIds.length === 1 ? 'work' : 'works'}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {philosopher.name}
                  </h3>
                </motion.button>
              )
            })}
          </div>

          {/* Empty state */}
          {filteredPhilosophers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-[var(--text-secondary)] font-body">
                No philosophers found in this category.
              </p>
              <button
                onClick={() => setFilterCategory('all')}
                className="mt-4 text-[var(--accent-primary)] hover:underline font-ui"
              >
                View all philosophers
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Philosopher Modal */}
      <AnimatePresence>
        {selectedPhilosopher && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPhilosopher(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="mx-4 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] shadow-2xl border border-[var(--border-primary)]">
                {/* Header with portrait */}
                <div className="relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPhilosopher(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-6 p-6 pb-4">
                    {/* Portrait */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] overflow-hidden shrink-0">
                      {philosopherImages[selectedPhilosopher.name] && !failedImages.has(selectedPhilosopher.name) ? (
                        <img
                          src={philosopherImages[selectedPhilosopher.name]}
                          alt={selectedPhilosopher.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={() => setFailedImages(prev => new Set(prev).add(selectedPhilosopher.name))}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-4xl text-[var(--text-muted)]">
                            {selectedPhilosopher.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl sm:text-3xl font-medium text-[var(--text-primary)] mb-2">
                        {selectedPhilosopher.name}
                      </h2>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-ui ${categoryStyles[selectedPhilosopher.category]?.bg || ''} ${categoryStyles[selectedPhilosopher.category]?.text || ''}`}>
                          {categoryLabels[selectedPhilosopher.category] || 'Unknown'}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] font-ui">
                          {selectedPhilosopher.textIds.length} {selectedPhilosopher.textIds.length === 1 ? 'work' : 'works'} available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Works grid */}
                <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto">
                  <p className="text-xs font-ui text-[var(--text-muted)] uppercase tracking-wider mb-4">
                    Available Works
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getPhilosopherTexts(selectedPhilosopher.textIds).map(text => (
                      <Link
                        key={text.id}
                        to={`/texts/${text.id}`}
                        onClick={() => setSelectedPhilosopher(null)}
                        className="group flex flex-col p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-primary)] transition-all"
                      >
                        <h3 className="font-ui font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
                          {text.title}
                        </h3>
                        {text.year && (
                          <p className="text-xs text-[var(--text-muted)] mb-2">
                            {text.year}
                          </p>
                        )}
                        {text.description && (
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 font-body">
                            {text.description}
                          </p>
                        )}
                        <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Read</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
