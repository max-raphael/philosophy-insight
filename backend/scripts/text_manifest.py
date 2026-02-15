"""
Manifest of all philosophy texts to import from Project Gutenberg.
Each entry contains metadata and Gutenberg ID for import.
"""

from import_gutenberg import TextConfig

# =============================================================================
# ANCIENT PHILOSOPHY
# =============================================================================

PLATO = [
    TextConfig(
        gutenberg_id=1497, id='republic', title='Republic', author='Plato',
        translator='Benjamin Jowett', year='c. 375 BCE', category='ancient',
        description="Plato's masterwork on justice, the ideal state, and the nature of the soul. Features the Allegory of the Cave and theory of Forms."
    ),
    TextConfig(
        gutenberg_id=1600, id='symposium', title='Symposium', author='Plato',
        translator='Benjamin Jowett', year='c. 385 BCE', category='ancient',
        description="A philosophical dialogue on the nature of love, featuring speeches by Aristophanes, Socrates, and Alcibiades."
    ),
    TextConfig(
        gutenberg_id=1658, id='phaedo', title='Phaedo', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="Socrates' final hours, presenting arguments for the immortality of the soul and the philosopher's attitude toward death."
    ),
    TextConfig(
        gutenberg_id=1656, id='apology', title='Apology', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="Socrates' defense speech at his trial, exploring the examined life and the pursuit of wisdom."
    ),
    TextConfig(
        gutenberg_id=1643, id='meno', title='Meno', author='Plato',
        translator='Benjamin Jowett', year='c. 385 BCE', category='ancient',
        description="A dialogue on virtue and knowledge, featuring the famous slave-boy geometry demonstration and theory of recollection."
    ),
    TextConfig(
        gutenberg_id=1636, id='phaedrus', title='Phaedrus', author='Plato',
        translator='Benjamin Jowett', year='c. 370 BCE', category='ancient',
        description="On love, beauty, and the art of rhetoric. Contains the famous chariot allegory of the soul."
    ),
    TextConfig(
        gutenberg_id=1726, id='theaetetus', title='Theaetetus', author='Plato',
        translator='Benjamin Jowett', year='c. 369 BCE', category='ancient',
        description="A profound exploration of the nature of knowledge, examining perception, true belief, and justified true belief."
    ),
    TextConfig(
        gutenberg_id=1687, id='parmenides', title='Parmenides', author='Plato',
        translator='Benjamin Jowett', year='c. 370 BCE', category='ancient',
        description="A challenging dialogue where Parmenides critiques the young Socrates' theory of Forms."
    ),
    TextConfig(
        gutenberg_id=1735, id='sophist', title='Sophist', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="An investigation into the nature of being and non-being, featuring the Eleatic Stranger's method of division."
    ),
    TextConfig(
        gutenberg_id=1672, id='gorgias', title='Gorgias', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on rhetoric, power, and justice. Socrates argues that doing wrong is worse than suffering it."
    ),
    TextConfig(
        gutenberg_id=1591, id='protagoras', title='Protagoras', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="Socrates debates the great sophist Protagoras on whether virtue can be taught."
    ),
    TextConfig(
        gutenberg_id=1642, id='euthyphro', title='Euthyphro', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="On the nature of piety and the relationship between the gods and morality. The Euthyphro dilemma remains influential."
    ),
    TextConfig(
        gutenberg_id=1657, id='crito', title='Crito', author='Plato',
        translator='Benjamin Jowett', year='c. 399 BCE', category='ancient',
        description="Socrates explains why he refuses to escape from prison, exploring the citizen's obligation to the laws."
    ),
    TextConfig(
        gutenberg_id=1635, id='ion', title='Ion', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A short dialogue on poetry and inspiration, questioning whether rhapsodes possess true knowledge."
    ),
    TextConfig(
        gutenberg_id=1750, id='laws', title='Laws', author='Plato',
        translator='Benjamin Jowett', year='c. 347 BCE', category='ancient',
        description="Plato's longest and final work, a detailed discussion of legislation and political philosophy."
    ),
    TextConfig(
        gutenberg_id=1572, id='timaeus', title='Timaeus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="Plato's cosmology and natural philosophy, describing the creation of the universe by the Demiurge."
    ),
    TextConfig(
        gutenberg_id=1584, id='laches', title='Laches', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on the nature of courage, featuring Socrates questioning two Athenian generals."
    ),
    TextConfig(
        gutenberg_id=1580, id='charmides', title='Charmides', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue exploring temperance (sophrosyne) and self-knowledge through conversation with the young Charmides."
    ),
    TextConfig(
        gutenberg_id=1579, id='lysis', title='Lysis', author='Plato',
        translator='Benjamin Jowett', year='c. 380 BCE', category='ancient',
        description="A dialogue on the nature of friendship and love, set in a wrestling school with young Athenians."
    ),
    TextConfig(
        gutenberg_id=1598, id='euthydemus', title='Euthydemus', author='Plato',
        translator='Benjamin Jowett', year='c. 384 BCE', category='ancient',
        description="Socrates confronts two sophists using eristic arguments, exposing the limits of verbal trickery."
    ),
    TextConfig(
        gutenberg_id=1616, id='cratylus', title='Cratylus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="A dialogue on the philosophy of language: are names natural or conventional?"
    ),
    TextConfig(
        gutenberg_id=1744, id='philebus', title='Philebus', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="A dialogue on pleasure and the good life, arguing that the best life combines pleasure with intelligence."
    ),
    TextConfig(
        gutenberg_id=1738, id='statesman', title='Statesman', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="The Eleatic Stranger defines the statesman through the method of division, exploring political art."
    ),
    TextConfig(
        gutenberg_id=1571, id='critias', title='Critias', author='Plato',
        translator='Benjamin Jowett', year='c. 360 BCE', category='ancient',
        description="The unfinished sequel to Timaeus, containing the most detailed account of Atlantis."
    ),
    TextConfig(
        gutenberg_id=1676, id='alcibiades-i', title='Alcibiades I', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A dialogue on self-knowledge and the nature of justice, featuring Socrates and the young Alcibiades."
    ),
    TextConfig(
        gutenberg_id=1677, id='alcibiades-ii', title='Alcibiades II', author='Plato',
        translator='Benjamin Jowett', year='c. 390 BCE', category='ancient',
        description="A dialogue on prayer and wisdom, exploring what we should ask of the gods."
    ),
]

ARISTOTLE = [
    TextConfig(
        gutenberg_id=8438, id='nicomachean-ethics', title='Nicomachean Ethics', author='Aristotle',
        translator='W. D. Ross', year='c. 340 BCE', category='ancient',
        description="The foundational text of virtue ethics, exploring happiness, virtue, friendship, and the good life."
    ),
    TextConfig(
        gutenberg_id=6762, id='politics', title='Politics', author='Aristotle',
        translator='Benjamin Jowett', year='c. 350 BCE', category='ancient',
        description="Aristotle's examination of political community, citizenship, and forms of government."
    ),
    TextConfig(
        gutenberg_id=1974, id='poetics', title='Poetics', author='Aristotle',
        translator='S. H. Butcher', year='c. 335 BCE', category='ancient',
        description="The foundational work of literary criticism, analyzing tragedy, plot, character, and catharsis."
    ),
    TextConfig(
        gutenberg_id=2154, id='rhetoric', title='Rhetoric', author='Aristotle',
        translator='W. Rhys Roberts', year='c. 350 BCE', category='ancient',
        description="The art of persuasion examined systematically: ethos, pathos, logos, and the means of persuasion."
    ),
    TextConfig(
        gutenberg_id=6763, id='metaphysics', title='Metaphysics', author='Aristotle',
        translator='W. D. Ross', year='c. 350 BCE', category='ancient',
        description="Aristotle's investigation into being qua being, substance, causation, and the unmoved mover."
    ),
    TextConfig(
        gutenberg_id=5733, id='physics', title='Physics', author='Aristotle',
        translator='R. P. Hardie and R. K. Gaye', year='c. 350 BCE', category='ancient',
        description="Aristotle's natural philosophy: motion, change, time, place, and the infinite."
    ),
    TextConfig(
        gutenberg_id=5765, id='on-the-soul', title='On the Soul (De Anima)', author='Aristotle',
        translator='J. A. Smith', year='c. 350 BCE', category='ancient',
        description="Aristotle's psychology examining the soul as the form of the body, sensation, and intellect."
    ),
    TextConfig(
        gutenberg_id=5765, id='categories', title='Categories', author='Aristotle',
        translator='E. M. Edghill', year='c. 350 BCE', category='ancient',
        description="Aristotle's classification of the fundamental kinds of being: substance, quantity, quality, relation, etc."
    ),
    TextConfig(
        gutenberg_id=5763, id='history-of-animals', title='History of Animals', author='Aristotle',
        translator='D\'Arcy Wentworth Thompson', year='c. 343 BCE', category='ancient',
        description="Aristotle's biological treatise, systematically cataloguing animal life and laying foundations for zoology."
    ),
]

STOICS = [
    TextConfig(
        gutenberg_id=2680, id='meditations', title='Meditations', author='Marcus Aurelius',
        translator='George Long', year='c. 170 CE', category='ancient',
        description="The Roman Emperor's private philosophical journal, a cornerstone of Stoic literature on self-improvement."
    ),
    TextConfig(
        gutenberg_id=10661, id='discourses', title='Discourses', author='Epictetus',
        translator='George Long', year='c. 108 CE', category='ancient',
        description="The teachings of the former slave turned Stoic philosopher on freedom, virtue, and living according to nature."
    ),
    TextConfig(
        gutenberg_id=45109, id='enchiridion', title='Enchiridion', author='Epictetus',
        translator='Elizabeth Carter', year='c. 125 CE', category='ancient',
        description="The Stoic handbook: a concise manual of practical philosophy on what is and isn't within our control."
    ),
    TextConfig(
        gutenberg_id=64576, id='minor-dialogues', title='Minor Dialogues', author='Seneca',
        translator='Aubrey Stewart', year='c. 60 CE', category='ancient',
        description="Seneca's philosophical essays including On Providence, On Anger, On the Shortness of Life, and On Clemency."
    ),
    TextConfig(
        gutenberg_id=56075, id='morals-happy-life', title='Morals of a Happy Life', author='Seneca',
        translator='Roger L\'Estrange', year='c. 60 CE', category='ancient',
        description="Seneca's moral philosophy on happiness, benefits, anger, and clemency - core Stoic teachings."
    ),
    TextConfig(
        gutenberg_id=47001, id='on-duties', title='On Duties', author='Cicero',
        translator='Walter Miller', year='44 BCE', category='ancient',
        description="Cicero's treatise on moral obligations, examining honorable conduct in public and private life."
    ),
    TextConfig(
        gutenberg_id=14988, id='tusculan-disputations', title='Tusculan Disputations', author='Cicero',
        translator='C. D. Yonge', year='45 BCE', category='ancient',
        description="Cicero's philosophical dialogues on death, pain, grief, emotions, and virtue as sufficient for happiness."
    ),
    TextConfig(
        gutenberg_id=2808, id='on-friendship-and-old-age', title='On Friendship and Old Age', author='Cicero',
        translator='E. S. Shuckburgh', year='44 BCE', category='ancient',
        description="Two of Cicero's most beloved essays: Laelius on friendship and Cato on the art of growing old gracefully."
    ),
    TextConfig(
        gutenberg_id=54161, id='the-republic', title='The Republic', author='Cicero',
        translator='Francis Barham', year='54 BCE', category='ancient',
        description="Cicero's dialogue on the ideal state, justice, and the best form of government, modeled on Plato's Republic."
    ),
    TextConfig(
        gutenberg_id=14970, id='academica', title='Academica', author='Cicero',
        translator='James S. Reid', year='45 BCE', category='ancient',
        description="Cicero's exposition of Academic skepticism, examining the limits of human knowledge and certainty."
    ),
]

EPICUREANS_AND_OTHERS = [
    TextConfig(
        gutenberg_id=785, id='on-the-nature-of-things', title='On the Nature of Things', author='Lucretius',
        translator='William Ellery Leonard', year='c. 50 BCE', category='ancient',
        description="The great Epicurean poem explaining atomic theory, the mortality of the soul, and freedom from fear."
    ),
    TextConfig(
        gutenberg_id=57342, id='lives-of-philosophers', title='Lives of the Eminent Philosophers', author='Diogenes Laertius',
        translator='C. D. Yonge', year='c. 230 CE', category='ancient',
        description="Biographical sketches and doctrines of ancient Greek philosophers from Thales to Epicurus."
    ),
    TextConfig(
        gutenberg_id=42930, id='enneads-vol-1', title='Enneads, Volume 1', author='Plotinus',
        translator='Kenneth Sylvan Guthrie', year='c. 270 CE', category='ancient',
        description="The first volume of Plotinus's Neoplatonist philosophy, exploring the One, Intellect, and Soul."
    ),
    TextConfig(
        gutenberg_id=42931, id='enneads-vol-2', title='Enneads, Volume 2', author='Plotinus',
        translator='Kenneth Sylvan Guthrie', year='c. 270 CE', category='ancient',
        description="The second volume of Plotinus's Neoplatonist philosophy, continuing exploration of metaphysics and ethics."
    ),
    TextConfig(
        gutenberg_id=42932, id='enneads-vol-3', title='Enneads, Volume 3', author='Plotinus',
        translator='Kenneth Sylvan Guthrie', year='c. 270 CE', category='ancient',
        description="The third volume of Plotinus's Neoplatonist philosophy on the soul's relation to the divine."
    ),
    TextConfig(
        gutenberg_id=42933, id='enneads-vol-4', title='Enneads, Volume 4', author='Plotinus',
        translator='Kenneth Sylvan Guthrie', year='c. 270 CE', category='ancient',
        description="The fourth volume completing Plotinus's Neoplatonist philosophy and mystical theology."
    ),
    TextConfig(
        gutenberg_id=29510, id='essay-on-the-beautiful', title='An Essay on the Beautiful', author='Plotinus',
        translator='Thomas Taylor', year='c. 260 CE', category='ancient',
        description="Plotinus's treatise on beauty and its relation to the divine, foundational to Neoplatonist aesthetics."
    ),
    TextConfig(
        gutenberg_id=74253, id='proclus-euclid', title='Proclus: Commentary on the First Book of Euclid', author='Proclus',
        translator='Thomas Taylor', year='c. 450 CE', category='ancient',
        description="Proclus's philosophical commentary on Euclid, revealing Neoplatonist views on mathematics and reality."
    ),
    TextConfig(
        gutenberg_id=77393, id='proclus-theology-plato', title='On the Theology of Plato', author='Proclus',
        translator='Thomas Taylor', year='c. 450 CE', category='ancient',
        description="Proclus's systematic exposition of Neoplatonist theology based on Plato's dialogues."
    ),
    TextConfig(
        gutenberg_id=77014, id='porphyry-select-works', title='Select Works of Porphyry', author='Porphyry',
        translator='Thomas Taylor', year='c. 270 CE', category='ancient',
        description="Works by Plotinus's student including philosophical treatises and the famous Isagoge on categories."
    ),
    TextConfig(
        gutenberg_id=63300, id='iamblichus-pythagoras', title='Life of Pythagoras', author='Iamblichus',
        translator='Thomas Taylor', year='c. 300 CE', category='ancient',
        description="Iamblichus's biography of Pythagoras revealing the mystical-philosophical teachings of the Pythagoreans."
    ),
    TextConfig(
        gutenberg_id=72815, id='iamblichus-mysteries', title='On the Mysteries', author='Iamblichus',
        translator='Thomas Taylor', year='c. 300 CE', category='ancient',
        description="Iamblichus's defense of theurgy and religious ritual, a key text of later Neoplatonism."
    ),
    TextConfig(
        gutenberg_id=1177, id='memorabilia', title='Memorabilia', author='Xenophon',
        translator='H. G. Dakyns', year='c. 370 BCE', category='ancient',
        description="Xenophon's recollections of Socrates, offering a different portrait than Plato's dialogues."
    ),
]

SKEPTICS_AND_PRESOCRATICS = [
    TextConfig(
        gutenberg_id=17556, id='sextus-empiricus', title='Sextus Empiricus and Greek Scepticism', author='Mary Mills Patrick',
        translator=None, year='1899', category='ancient',
        description="Study of Pyrrhonian skepticism through Sextus Empiricus, examining the suspension of judgment."
    ),
    TextConfig(
        gutenberg_id=67097, id='early-greek-philosophy', title='Early Greek Philosophy', author='John Burnet',
        translator=None, year='1892', category='ancient',
        description="Burnet's authoritative collection and analysis of the Pre-Socratic philosophers."
    ),
    TextConfig(
        gutenberg_id=69174, id='golden-verses-pythagoras', title='The Golden Verses of Pythagoras', author='Pythagoras',
        translator='Fabre d\'Olivet', year='c. 500 BCE', category='ancient',
        description="The ethical maxims attributed to Pythagoras with philosophical commentary."
    ),
]

STOICS_ADDITIONAL = [
    TextConfig(
        gutenberg_id=871, id='golden-sayings-epictetus', title='Golden Sayings of Epictetus with Hymn of Cleanthes', author='Epictetus',
        translator='Hastings Crossley', year='c. 125 CE', category='ancient',
        description="Selected teachings of Epictetus with the famous Hymn to Zeus by the Stoic Cleanthes."
    ),
    TextConfig(
        gutenberg_id=7514, id='guide-to-stoicism', title='A Guide to Stoicism', author='St George Stock',
        translator=None, year='1915', category='ancient',
        description="An accessible introduction to Stoic philosophy covering logic, physics, and ethics."
    ),
    TextConfig(
        gutenberg_id=64488, id='roman-stoicism', title='Roman Stoicism', author='E. V. Arnold',
        translator=None, year='1911', category='ancient',
        description="Comprehensive study of Stoicism in Rome from Cicero through Marcus Aurelius."
    ),
]

PLUTARCH = [
    TextConfig(
        gutenberg_id=23639, id='plutarch-morals', title="Plutarch's Morals", author='Plutarch',
        translator='William W. Goodwin', year='c. 100 CE', category='ancient',
        description="Plutarch's essays on ethics, education, and practical philosophy, rivaling the Lives in influence."
    ),
    TextConfig(
        gutenberg_id=62618, id='plutarch-essays-1', title='Selected Essays of Plutarch, Volume 1', author='Plutarch',
        translator='A. O. Prickard', year='c. 100 CE', category='ancient',
        description="First volume of Plutarch's philosophical and moral essays."
    ),
    TextConfig(
        gutenberg_id=62858, id='plutarch-essays-2', title='Selected Essays of Plutarch, Volume 2', author='Plutarch',
        translator='A. O. Prickard', year='c. 100 CE', category='ancient',
        description="Second volume of Plutarch's philosophical and moral essays."
    ),
]

# =============================================================================
# RENAISSANCE PHILOSOPHY
# =============================================================================

RENAISSANCE = [
    TextConfig(
        gutenberg_id=19817, id='bruno-enthusiasts-1', title='The Heroic Enthusiasts, Part 1', author='Giordano Bruno',
        translator='L. Williams', year='1585', category='enlightenment',
        description="Bruno's philosophical dialogue on heroic love and the soul's ascent to divine beauty."
    ),
    TextConfig(
        gutenberg_id=19833, id='bruno-enthusiasts-2', title='The Heroic Enthusiasts, Part 2', author='Giordano Bruno',
        translator='L. Williams', year='1585', category='enlightenment',
        description="The second part of Bruno's dialogue on transcendent love and philosophical contemplation."
    ),
    TextConfig(
        gutenberg_id=30201, id='erasmus-folly', title='In Praise of Folly', author='Desiderius Erasmus',
        translator='John Wilson', year='1511', category='enlightenment',
        description="Erasmus's satirical masterpiece critiquing society, church, and scholars through Folly's speech."
    ),
    TextConfig(
        gutenberg_id=14031, id='erasmus-colloquies', title='Colloquies, Volume 1', author='Desiderius Erasmus',
        translator='N. Bailey', year='1518', category='enlightenment',
        description="Erasmus's dialogues combining humanist learning with social criticism and moral instruction."
    ),
    TextConfig(
        gutenberg_id=39487, id='erasmus-against-war', title='Erasmus Against War', author='Desiderius Erasmus',
        translator='J. W. Mackail', year='1517', category='enlightenment',
        description="Erasmus's pacifist treatise arguing against war from Christian humanist principles."
    ),
    TextConfig(
        gutenberg_id=2130, id='more-utopia', title='Utopia', author='Thomas More',
        translator='Gilbert Burnet', year='1516', category='enlightenment',
        description="More's influential vision of an ideal society, blending social criticism with political philosophy."
    ),
]

# =============================================================================
# MEDIEVAL PHILOSOPHY
# =============================================================================

MEDIEVAL = [
    TextConfig(
        gutenberg_id=3296, id='confessions', title='Confessions', author='Augustine of Hippo',
        translator='E. B. Pusey', year='397 CE', category='medieval',
        description="Augustine's spiritual autobiography, exploring memory, time, and the soul's journey to God."
    ),
    TextConfig(
        gutenberg_id=45304, id='city-of-god', title='City of God', author='Augustine of Hippo',
        translator='Marcus Dods', year='426 CE', category='medieval',
        description="Augustine's monumental defense of Christianity against paganism, contrasting the earthly and heavenly cities."
    ),
    TextConfig(
        gutenberg_id=14328, id='consolation-of-philosophy', title='Consolation of Philosophy', author='Boethius',
        translator='H. R. James', year='524 CE', category='medieval',
        description="Philosophy personified consoles the imprisoned Boethius, discussing fate, free will, and true happiness."
    ),
    TextConfig(
        gutenberg_id=17611, id='summa-theologica', title='Summa Theologica', author='Thomas Aquinas',
        translator='Fathers of the English Dominican Province', year='1274', category='medieval',
        description="Aquinas's systematic theology synthesizing Christian doctrine with Aristotelian philosophy."
    ),
    TextConfig(
        gutenberg_id=50896, id='guide-for-the-perplexed', title='Guide for the Perplexed', author='Moses Maimonides',
        translator='M. Friedländer', year='1190', category='medieval',
        description="Maimonides reconciles Jewish theology with Aristotelian philosophy, addressing divine attributes and prophecy."
    ),
]

# =============================================================================
# EARLY MODERN / ENLIGHTENMENT
# =============================================================================

BACON = [
    TextConfig(
        gutenberg_id=45988, id='novum-organum', title='Novum Organum', author='Francis Bacon',
        translator=None, year='1620', category='enlightenment',
        description="Bacon's foundational work on scientific method, introducing inductive reasoning to replace Aristotelian logic."
    ),
    TextConfig(
        gutenberg_id=5500, id='advancement-of-learning', title='The Advancement of Learning', author='Francis Bacon',
        translator=None, year='1605', category='enlightenment',
        description="Bacon's influential treatise on the organization and progress of human knowledge."
    ),
]

RATIONALISTS = [
    TextConfig(
        gutenberg_id=59, id='discourse-on-method', title='Discourse on Method', author='René Descartes',
        translator='John Veitch', year='1637', category='enlightenment',
        description="Descartes' foundational work introducing systematic doubt and the famous 'cogito ergo sum'."
    ),
    TextConfig(
        gutenberg_id=3800, id='ethics', title='Ethics', author='Baruch Spinoza',
        translator='R. H. M. Elwes', year='1677', category='enlightenment',
        description="Spinoza's masterwork using geometric method to explore God, mind, emotions, and human freedom."
    ),
    TextConfig(
        gutenberg_id=989, id='theological-political-treatise', title='Theological-Political Treatise', author='Baruch Spinoza',
        translator='R. H. M. Elwes', year='1670', category='enlightenment',
        description="Spinoza's defense of freedom of thought, biblical criticism, and the separation of philosophy from theology."
    ),
    TextConfig(
        gutenberg_id=1016, id='spinoza-improvement', title='On the Improvement of the Understanding', author='Baruch Spinoza',
        translator='R. H. M. Elwes', year='1677', category='enlightenment',
        description="Spinoza's unfinished treatise on method and the path to true knowledge and blessedness."
    ),
    TextConfig(
        gutenberg_id=39441, id='monadology', title='Monadology', author='Gottfried Wilhelm Leibniz',
        translator='George Montgomery', year='1714', category='enlightenment',
        description="Leibniz's compact presentation of his metaphysics of monads, pre-established harmony, and the best of all possible worlds."
    ),
    TextConfig(
        gutenberg_id=17147, id='leibniz-theodicy', title='Theodicy', author='Gottfried Wilhelm Leibniz',
        translator='E. M. Huggard', year='1710', category='enlightenment',
        description="Leibniz's defense of divine justice explaining evil in the best of all possible worlds."
    ),
    TextConfig(
        gutenberg_id=40957, id='leibniz-new-essays', title='New Essays Concerning Human Understanding', author='Gottfried Wilhelm Leibniz',
        translator='Alfred Gideon Langley', year='1704', category='enlightenment',
        description="Leibniz's response to Locke, defending innate ideas and the active nature of mind."
    ),
]

EMPIRICISTS = [
    TextConfig(
        gutenberg_id=10615, id='essay-concerning-human-understanding', title='Essay Concerning Human Understanding', author='John Locke',
        translator=None, year='1689', category='enlightenment',
        description="Locke's foundational empiricist work on the origins, extent, and certainty of human knowledge."
    ),
    TextConfig(
        gutenberg_id=7370, id='two-treatises-of-government', title='Two Treatises of Government', author='John Locke',
        translator=None, year='1689', category='enlightenment',
        description="Locke's political philosophy: natural rights, government by consent, and the right of revolution."
    ),
    TextConfig(
        gutenberg_id=4723, id='principles-of-human-knowledge', title='Principles of Human Knowledge', author='George Berkeley',
        translator=None, year='1710', category='enlightenment',
        description="Berkeley's idealism: 'to be is to be perceived.' A radical empiricist rejection of material substance."
    ),
    TextConfig(
        gutenberg_id=4724, id='three-dialogues', title='Three Dialogues between Hylas and Philonous', author='George Berkeley',
        translator=None, year='1713', category='enlightenment',
        description="Berkeley defends immaterialism through lively dialogue, arguing that matter does not exist independently of perception."
    ),
    TextConfig(
        gutenberg_id=39746, id='berkeley-works-1', title='The Works of George Berkeley, Volume 1', author='George Berkeley',
        translator=None, year='Various', category='enlightenment',
        description="Collected philosophical works of Berkeley including early essays on vision and perception."
    ),
    TextConfig(
        gutenberg_id=4722, id='berkeley-new-theory-vision', title='An Essay Towards a New Theory of Vision', author='George Berkeley',
        translator=None, year='1709', category='enlightenment',
        description="Berkeley's groundbreaking analysis of visual perception and the relationship between sight and touch."
    ),
    TextConfig(
        gutenberg_id=4705, id='treatise-of-human-nature', title='A Treatise of Human Nature', author='David Hume',
        translator=None, year='1739', category='enlightenment',
        description="Hume's ambitious attempt to introduce experimental method into moral subjects, examining understanding, passions, and morals.",
        structure_depth=2  # Parse PART/SECTION within BOOK
    ),
    TextConfig(
        gutenberg_id=9662, id='enquiry-concerning-human-understanding', title='An Enquiry Concerning Human Understanding', author='David Hume',
        translator=None, year='1748', category='enlightenment',
        description="Hume's accessible reworking of his epistemology, famous for its analysis of causation and the problem of induction.",
        structure_hint='paragraphs'  # Sparse structural markers, force paragraph chunking
    ),
    TextConfig(
        gutenberg_id=4320, id='enquiry-concerning-morals', title='An Enquiry Concerning the Principles of Morals', author='David Hume',
        translator=None, year='1751', category='enlightenment',
        description="Hume's moral philosophy grounding ethics in sentiment and utility rather than reason alone."
    ),
    TextConfig(
        gutenberg_id=4583, id='dialogues-concerning-natural-religion', title='Dialogues Concerning Natural Religion', author='David Hume',
        translator=None, year='1779', category='enlightenment',
        description="Hume's posthumous critique of arguments for God's existence, presented through three philosophical characters."
    ),
    TextConfig(
        gutenberg_id=36120, id='hume-essays', title='Essays: Moral, Political, and Literary', author='David Hume',
        translator=None, year='1741-77', category='enlightenment',
        description="Hume's wide-ranging essays on taste, commerce, politics, and philosophy for general readers."
    ),
    TextConfig(
        gutenberg_id=59792, id='hume-political-discourses', title='Political Discourses', author='David Hume',
        translator=None, year='1752', category='enlightenment',
        description="Hume's influential essays on economics, commerce, and political economy."
    ),
]

KANT = [
    TextConfig(
        gutenberg_id=4280, id='critique-of-pure-reason', title='Critique of Pure Reason', author='Immanuel Kant',
        translator='J. M. D. Meiklejohn', year='1781', category='enlightenment',
        description="Kant's revolutionary examination of the limits and possibilities of human knowledge, establishing transcendental idealism.",
        structure_hint='paragraphs'  # Sparse structural markers (only 4 BOOK + 4 SECTION for 1.3M chars), force paragraph chunking
    ),
    TextConfig(
        gutenberg_id=5683, id='critique-of-practical-reason', title='Critique of Practical Reason', author='Immanuel Kant',
        translator='Thomas Kingsmill Abbott', year='1788', category='enlightenment',
        description="Kant's moral philosophy establishing the categorical imperative as the supreme principle of morality."
    ),
    TextConfig(
        gutenberg_id=48433, id='critique-of-judgment', title='Critique of Judgment', author='Immanuel Kant',
        translator='J. H. Bernard', year='1790', category='enlightenment',
        description="Kant's aesthetics and teleology, bridging the gap between nature and freedom through beauty and purposiveness."
    ),
    TextConfig(
        gutenberg_id=5682, id='groundwork-metaphysics-morals', title='Groundwork of the Metaphysics of Morals', author='Immanuel Kant',
        translator='Thomas Kingsmill Abbott', year='1785', category='enlightenment',
        description="Kant's foundational work in ethics, arguing for duty-based morality and the categorical imperative."
    ),
    TextConfig(
        gutenberg_id=52821, id='prolegomena', title='Prolegomena to Any Future Metaphysics', author='Immanuel Kant',
        translator='Paul Carus', year='1783', category='enlightenment',
        description="Kant's accessible summary of the Critique of Pure Reason, explaining how synthetic a priori knowledge is possible."
    ),
    TextConfig(
        gutenberg_id=50922, id='perpetual-peace', title='Perpetual Peace', author='Immanuel Kant',
        translator='W. Hastie', year='1795', category='enlightenment',
        description="Kant's vision for lasting international peace through republicanism, federation, and cosmopolitan law."
    ),
]

POLITICAL_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=3207, id='leviathan', title='Leviathan', author='Thomas Hobbes',
        translator=None, year='1651', category='enlightenment',
        description="Hobbes' social contract theory: life in the state of nature is 'solitary, poor, nasty, brutish, and short.'"
    ),
    TextConfig(
        gutenberg_id=46333, id='social-contract', title='The Social Contract', author='Jean-Jacques Rousseau',
        translator='G. D. H. Cole', year='1762', category='enlightenment',
        description="Rousseau's political philosophy: 'Man is born free, and everywhere he is in chains.' On the general will and legitimate government."
    ),
    TextConfig(
        gutenberg_id=11136, id='discourse-on-inequality', title='Discourse on Inequality', author='Jean-Jacques Rousseau',
        translator='G. D. H. Cole', year='1755', category='enlightenment',
        description="Rousseau traces the origins of inequality, arguing that civilization has corrupted natural human goodness."
    ),
    TextConfig(
        gutenberg_id=1232, id='the-prince', title='The Prince', author='Niccolò Machiavelli',
        translator='W. K. Marriott', year='1532', category='enlightenment',
        description="The foundational text of modern political philosophy on power, statecraft, and political leadership."
    ),
    TextConfig(
        gutenberg_id=10827, id='discourses-on-livy', title='Discourses on Livy', author='Niccolò Machiavelli',
        translator='Ninian Hill Thomson', year='1531', category='enlightenment',
        description="Machiavelli's republican political theory, analyzing Roman history for lessons on liberty and civic virtue."
    ),
]

OTHER_ENLIGHTENMENT = [
    TextConfig(
        gutenberg_id=18269, id='pensees', title='Pensées', author='Blaise Pascal',
        translator='W. F. Trotter', year='1670', category='enlightenment',
        description="Pascal's fragmentary reflections on faith, reason, and the human condition, including the famous 'wager' argument."
    ),
    TextConfig(
        gutenberg_id=19942, id='candide', title='Candide', author='Voltaire',
        translator=None, year='1759', category='enlightenment',
        description="Voltaire's satirical masterpiece ridiculing optimism and religious hypocrisy through the misadventures of Candide."
    ),
    TextConfig(
        gutenberg_id=31270, id='rights-of-man', title='Rights of Man', author='Thomas Paine',
        translator=None, year='1791', category='enlightenment',
        description="Paine's defense of the French Revolution and natural rights against Burke's conservative critique."
    ),
    TextConfig(
        gutenberg_id=3743, id='age-of-reason', title='The Age of Reason', author='Thomas Paine',
        translator=None, year='1794', category='enlightenment',
        description="Paine's deist critique of organized religion and biblical authority, advocating reason over revelation."
    ),
    TextConfig(
        gutenberg_id=5427, id='emile', title='Emile, or On Education', author='Jean-Jacques Rousseau',
        translator='Barbara Foxley', year='1762', category='enlightenment',
        description="Rousseau's influential treatise on education and human nature, tracing development from infancy to adulthood."
    ),
    TextConfig(
        gutenberg_id=18569, id='philosophical-dictionary', title='Philosophical Dictionary', author='Voltaire',
        translator=None, year='1764', category='enlightenment',
        description="Voltaire's encyclopedic collection of essays attacking religious intolerance and promoting Enlightenment values."
    ),
    TextConfig(
        gutenberg_id=67363, id='theory-of-moral-sentiments', title='The Theory of Moral Sentiments', author='Adam Smith',
        translator=None, year='1759', category='enlightenment',
        description="Adam Smith's moral philosophy grounding ethics in sympathy and the impartial spectator, foundational to his economic theory.",
        structure_depth=2  # Parse SECTION/CHAPTER within PART
    ),
    TextConfig(
        gutenberg_id=3600, id='essays-montaigne', title='Essays', author='Michel de Montaigne',
        translator='Charles Cotton', year='1580', category='enlightenment',
        description="Montaigne's revolutionary personal essays, exploring skepticism, self-knowledge, and the human condition."
    ),
]

FRENCH_MATERIALISTS = [
    TextConfig(
        gutenberg_id=8909, id='holbach-system-nature-1', title='The System of Nature, Volume 1', author="Baron d'Holbach",
        translator='H. D. Robinson', year='1770', category='enlightenment',
        description="Holbach's atheist and materialist manifesto, arguing nature is all that exists."
    ),
    TextConfig(
        gutenberg_id=8910, id='holbach-system-nature-2', title='The System of Nature, Volume 2', author="Baron d'Holbach",
        translator='H. D. Robinson', year='1770', category='enlightenment',
        description="The second volume completing Holbach's systematic materialist philosophy."
    ),
    TextConfig(
        gutenberg_id=7319, id='holbach-good-sense', title='Good Sense', author="Baron d'Holbach",
        translator=None, year='1772', category='enlightenment',
        description="Holbach's accessible summary of atheist arguments for general readers."
    ),
    TextConfig(
        gutenberg_id=40770, id='holbach-christianity-unveiled', title='Christianity Unveiled', author="Baron d'Holbach",
        translator='W. M. Johnson', year='1761', category='enlightenment',
        description="Holbach's critique of Christianity as harmful to society and morality."
    ),
    TextConfig(
        gutenberg_id=17607, id='holbach-superstition', title='Superstition in All Ages', author="Jean Meslier",
        translator=None, year='1733', category='enlightenment',
        description="Meslier's posthumous atheist testament, one of the first explicitly atheist philosophical works."
    ),
    TextConfig(
        gutenberg_id=52090, id='la-mettrie-man-machine', title='Man a Machine', author='Julien Offray de La Mettrie',
        translator='Gertrude Carman Bussey', year='1747', category='enlightenment',
        description="La Mettrie's materialist view that humans are purely mechanical beings without souls."
    ),
    TextConfig(
        gutenberg_id=13862, id='diderot-rameau', title="Rameau's Nephew", author='Denis Diderot',
        translator='Jacques Barzun', year='1761', category='enlightenment',
        description="Diderot's brilliant dialogue on morality, genius, and society through a bohemian character."
    ),
]

FRENCH_MORALISTS = [
    TextConfig(
        gutenberg_id=9105, id='rochefoucauld-maxims', title='Reflections; or Sentences and Moral Maxims', author='François de La Rochefoucauld',
        translator=None, year='1665', category='enlightenment',
        description="La Rochefoucauld's cynical maxims exposing self-interest as the hidden motive behind human actions."
    ),
    TextConfig(
        gutenberg_id=46633, id='la-bruyere-characters', title='The Characters', author='Jean de La Bruyère',
        translator='Henri Van Laun', year='1688', category='enlightenment',
        description="La Bruyère's witty character sketches and moral observations of French society."
    ),
]

SCOTTISH_ENLIGHTENMENT = [
    TextConfig(
        gutenberg_id=8646, id='ferguson-civil-society', title='An Essay on the History of Civil Society', author='Adam Ferguson',
        translator=None, year='1767', category='enlightenment',
        description="Ferguson's sociological analysis of progress and the moral dangers of commercial society."
    ),
]

VOLTAIRE_ADDITIONAL = [
    TextConfig(
        gutenberg_id=64858, id='voltaire-toleration', title='Toleration and Other Essays', author='Voltaire',
        translator='Joseph McCabe', year='1763', category='enlightenment',
        description="Voltaire's passionate defense of religious tolerance and Enlightenment values."
    ),
    TextConfig(
        gutenberg_id=2445, id='voltaire-letters-england', title='Letters on England', author='Voltaire',
        translator=None, year='1733', category='enlightenment',
        description="Voltaire's influential comparison of English and French society, praising English liberty."
    ),
]

# =============================================================================
# 19TH CENTURY
# =============================================================================

GERMAN_IDEALISM = [
    TextConfig(
        gutenberg_id=6698, id='phenomenology-of-spirit', title='Phenomenology of Spirit', author='G. W. F. Hegel',
        translator='J. B. Baillie', year='1807', category='modern',
        description="Hegel's account of consciousness's development from sense-certainty to absolute knowing, including the master-slave dialectic."
    ),
    TextConfig(
        gutenberg_id=857, id='philosophy-of-history', title='Philosophy of History', author='G. W. F. Hegel',
        translator='J. Sibree', year='1837', category='modern',
        description="Hegel's lectures on world history as the progress of the consciousness of freedom."
    ),
    TextConfig(
        gutenberg_id=51635, id='hegel-history-philosophy-1', title='Lectures on the History of Philosophy, Volume 1', author='G. W. F. Hegel',
        translator='E. S. Haldane', year='1837', category='modern',
        description="Hegel's comprehensive history of philosophy from the Greeks through the Scholastics."
    ),
    TextConfig(
        gutenberg_id=51636, id='hegel-history-philosophy-2', title='Lectures on the History of Philosophy, Volume 2', author='G. W. F. Hegel',
        translator='E. S. Haldane', year='1837', category='modern',
        description="Hegel's history of philosophy covering medieval and early modern thought."
    ),
    TextConfig(
        gutenberg_id=58169, id='hegel-history-philosophy-3', title='Lectures on the History of Philosophy, Volume 3', author='G. W. F. Hegel',
        translator='E. S. Haldane', year='1837', category='modern',
        description="Hegel's history of philosophy concluding with German idealism."
    ),
    TextConfig(
        gutenberg_id=55108, id='hegel-logic', title='The Science of Logic', author='G. W. F. Hegel',
        translator='W. H. Johnston and L. G. Struthers', year='1812', category='modern',
        description="Hegel's systematic development of logical categories as the self-movement of thought."
    ),
    TextConfig(
        gutenberg_id=39064, id='hegel-philosophy-mind', title='Philosophy of Mind', author='G. W. F. Hegel',
        translator='William Wallace', year='1817', category='modern',
        description="The third part of Hegel's Encyclopedia on subjective, objective, and absolute spirit."
    ),
    TextConfig(
        gutenberg_id=55334, id='hegel-fine-art-1', title='The Philosophy of Fine Art, Volume 1', author='G. W. F. Hegel',
        translator='F. P. B. Osmaston', year='1835', category='modern',
        description="Hegel's aesthetics: the nature of beauty and art's role in human culture."
    ),
    TextConfig(
        gutenberg_id=55445, id='hegel-fine-art-2', title='The Philosophy of Fine Art, Volume 2', author='G. W. F. Hegel',
        translator='F. P. B. Osmaston', year='1835', category='modern',
        description="Hegel on symbolic, classical, and romantic art forms."
    ),
    TextConfig(
        gutenberg_id=55623, id='hegel-fine-art-3', title='The Philosophy of Fine Art, Volume 3', author='G. W. F. Hegel',
        translator='F. P. B. Osmaston', year='1835', category='modern',
        description="Hegel on architecture, sculpture, and painting as art forms."
    ),
    TextConfig(
        gutenberg_id=55731, id='hegel-fine-art-4', title='The Philosophy of Fine Art, Volume 4', author='G. W. F. Hegel',
        translator='F. P. B. Osmaston', year='1835', category='modern',
        description="Hegel on music and poetry, completing his philosophy of the arts."
    ),
    TextConfig(
        gutenberg_id=38427, id='world-as-will-and-representation', title='The World as Will and Representation', author='Arthur Schopenhauer',
        translator='R. B. Haldane and J. Kemp', year='1818', category='modern',
        description="Schopenhauer's pessimistic philosophy: the world is driven by blind will, and salvation lies in aesthetic contemplation and asceticism."
    ),
    TextConfig(
        gutenberg_id=50966, id='schopenhauer-fourfold-root', title='On the Fourfold Root of the Principle of Sufficient Reason', author='Arthur Schopenhauer',
        translator='Karl Hillebrand', year='1813', category='modern',
        description="Schopenhauer's doctoral dissertation establishing the epistemological basis for his philosophy."
    ),
    TextConfig(
        gutenberg_id=44929, id='schopenhauer-basis-morality', title='The Basis of Morality', author='Arthur Schopenhauer',
        translator='Arthur Brodrick Bullock', year='1840', category='modern',
        description="Schopenhauer's ethics grounding morality in compassion rather than Kantian duty."
    ),
    TextConfig(
        gutenberg_id=10739, id='schopenhauer-human-nature', title='Essays of Schopenhauer: On Human Nature', author='Arthur Schopenhauer',
        translator='T. Bailey Saunders', year='1851', category='modern',
        description="Schopenhauer's essays on character, psychology, and the human condition."
    ),
    TextConfig(
        gutenberg_id=10731, id='schopenhauer-controversy', title='The Art of Controversy', author='Arthur Schopenhauer',
        translator='T. Bailey Saunders', year='1851', category='modern',
        description="Schopenhauer's witty guide to winning arguments through rhetorical tricks."
    ),
    TextConfig(
        gutenberg_id=10714, id='schopenhauer-literature', title='The Art of Literature', author='Arthur Schopenhauer',
        translator='T. Bailey Saunders', year='1851', category='modern',
        description="Schopenhauer's essays on style, authorship, and the value of reading."
    ),
    TextConfig(
        gutenberg_id=10833, id='schopenhauer-religion', title='Religion: A Dialogue and Other Essays', author='Arthur Schopenhauer',
        translator='T. Bailey Saunders', year='1851', category='modern',
        description="Schopenhauer's dialogues and essays on religion, metaphysics, and ethics."
    ),
    TextConfig(
        gutenberg_id=43544, id='schlegel-philosophy-life', title='The Philosophy of Life and Philosophy of Language', author='Friedrich Schlegel',
        translator='A. J. W. Morrison', year='1828', category='modern',
        description="Schlegel's lectures on the philosophy of life, consciousness, and language."
    ),
    TextConfig(
        gutenberg_id=38365, id='schlegel-philosophy-history-1', title='The Philosophy of History, Volume 1', author='Friedrich Schlegel',
        translator='James Burton Robertson', year='1829', category='modern',
        description="Schlegel's lectures on world history from a romantic-conservative perspective."
    ),
    TextConfig(
        gutenberg_id=48275, id='schlegel-philosophy-history-2', title='The Philosophy of History, Volume 2', author='Friedrich Schlegel',
        translator='James Burton Robertson', year='1829', category='modern',
        description="The second volume of Schlegel's philosophy of history lectures."
    ),
]

EXISTENTIALIST_PRECURSORS = [
    TextConfig(
        gutenberg_id=45644, id='fear-and-trembling', title='Fear and Trembling', author='Søren Kierkegaard',
        translator='Walter Lowrie', year='1843', category='modern',
        description="Kierkegaard's meditation on Abraham and Isaac, exploring faith as a leap beyond rational ethics."
    ),
]

NIETZSCHE = [
    TextConfig(
        gutenberg_id=4363, id='beyond-good-and-evil', title='Beyond Good and Evil', author='Friedrich Nietzsche',
        translator='Helen Zimmern', year='1886', category='modern',
        description="Nietzsche's critique of traditional morality with provocative aphorisms on truth, morality, and the will to power."
    ),
    TextConfig(
        gutenberg_id=1998, id='thus-spoke-zarathustra', title='Thus Spoke Zarathustra', author='Friedrich Nietzsche',
        translator='Thomas Common', year='1885', category='modern',
        description="Nietzsche's philosophical novel introducing the Übermensch, eternal recurrence, and the death of God.",
        structure_depth=2  # Parse CHAPTER within PART
    ),
    TextConfig(
        gutenberg_id=52319, id='genealogy-of-morals', title='On the Genealogy of Morals', author='Friedrich Nietzsche',
        translator='Horace B. Samuel', year='1887', category='modern',
        description="Nietzsche traces the origins of moral concepts, distinguishing master and slave morality."
    ),
    TextConfig(
        gutenberg_id=7372, id='birth-of-tragedy', title='The Birth of Tragedy', author='Friedrich Nietzsche',
        translator='William A. Haussmann', year='1872', category='modern',
        description="Nietzsche's first book on Greek tragedy, the Apollonian and Dionysian, and the death of tragedy through Socratic rationalism."
    ),
    TextConfig(
        gutenberg_id=52263, id='twilight-of-the-idols', title='Twilight of the Idols', author='Friedrich Nietzsche',
        translator='Anthony M. Ludovici', year='1889', category='modern',
        description="Nietzsche's concise critique of Western philosophy and culture, 'philosophizing with a hammer.'"
    ),
    TextConfig(
        gutenberg_id=19322, id='antichrist', title='The Antichrist', author='Friedrich Nietzsche',
        translator='H. L. Mencken', year='1895', category='modern',
        description="Nietzsche's polemical attack on Christianity as a religion of weakness and resentment."
    ),
    TextConfig(
        gutenberg_id=38145, id='human-all-too-human', title='Human, All Too Human', author='Friedrich Nietzsche',
        translator='Alexander Harvey', year='1878', category='modern',
        description="Nietzsche's break with Wagner and metaphysics, applying psychological analysis to moral and cultural phenomena."
    ),
    TextConfig(
        gutenberg_id=52881, id='gay-science', title='The Gay Science', author='Friedrich Nietzsche',
        translator='Thomas Common', year='1882', category='modern',
        description="'God is dead': Nietzsche announces the death of God and explores its implications for knowledge, art, and life."
    ),
    TextConfig(
        gutenberg_id=52190, id='ecce-homo', title='Ecce Homo', author='Friedrich Nietzsche',
        translator='Anthony M. Ludovici', year='1888', category='modern',
        description="Nietzsche's intellectual autobiography: 'Why I Am So Wise, Why I Am So Clever, Why I Write Such Good Books.'"
    ),
]

BRITISH_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=34901, id='on-liberty', title='On Liberty', author='John Stuart Mill',
        translator=None, year='1859', category='modern',
        description="Mill's classic defense of individual freedom against the tyranny of the majority and social conformity."
    ),
    TextConfig(
        gutenberg_id=11224, id='utilitarianism', title='Utilitarianism', author='John Stuart Mill',
        translator=None, year='1863', category='modern',
        description="Mill's systematic defense of the greatest happiness principle as the foundation of morality."
    ),
    TextConfig(
        gutenberg_id=27083, id='subjection-of-women', title='The Subjection of Women', author='John Stuart Mill',
        translator=None, year='1869', category='modern',
        description="Mill's feminist argument for legal and social equality between the sexes."
    ),
    TextConfig(
        gutenberg_id=6726, id='principles-of-morals', title='An Introduction to the Principles of Morals and Legislation', author='Jeremy Bentham',
        translator=None, year='1789', category='modern',
        description="Bentham's foundational utilitarian text introducing the principle of utility and felicific calculus."
    ),
    TextConfig(
        gutenberg_id=27942, id='system-of-logic', title='A System of Logic', author='John Stuart Mill',
        translator=None, year='1843', category='modern',
        description="Mill's comprehensive treatise on inductive reasoning, scientific method, and the logic of the moral sciences.",
        structure_depth=2  # Parse CHAPTER within BOOK
    ),
    TextConfig(
        gutenberg_id=10378, id='autobiography-mill', title='Autobiography', author='John Stuart Mill',
        translator=None, year='1873', category='modern',
        description="Mill's candid account of his unusual education, mental crisis, and intellectual development."
    ),
    TextConfig(
        gutenberg_id=55046, id='first-principles', title='First Principles', author='Herbert Spencer',
        translator=None, year='1862', category='modern',
        description="Spencer's evolutionary philosophy synthesizing science and philosophy into a unified system."
    ),
    TextConfig(
        gutenberg_id=46743, id='methods-of-ethics', title='The Methods of Ethics', author='Henry Sidgwick',
        translator=None, year='1874', category='modern',
        description="Sidgwick's systematic examination of ethical methods: egoism, intuitionism, and utilitarianism."
    ),
    TextConfig(
        gutenberg_id=4212, id='culture-and-anarchy', title='Culture and Anarchy', author='Matthew Arnold',
        translator=None, year='1869', category='modern',
        description="Arnold's critique of Victorian society and defense of culture as the pursuit of perfection."
    ),
    TextConfig(
        gutenberg_id=36541, id='unto-this-last', title='Unto This Last', author='John Ruskin',
        translator=None, year='1860', category='modern',
        description="Ruskin's influential critique of industrial capitalism and laissez-faire economics."
    ),
    TextConfig(
        gutenberg_id=1091, id='on-heroes', title='On Heroes, Hero-Worship, and the Heroic in History', author='Thomas Carlyle',
        translator=None, year='1841', category='modern',
        description="Carlyle's lectures on great men as the driving force of history, from Odin to Napoleon."
    ),
    TextConfig(
        gutenberg_id=19690, id='apologia-pro-vita-sua', title='Apologia Pro Vita Sua', author='John Henry Newman',
        translator=None, year='1864', category='modern',
        description="Newman's spiritual autobiography defending his conversion from Anglicanism to Roman Catholicism."
    ),
]

BRITISH_IDEALISTS = [
    TextConfig(
        gutenberg_id=63249, id='bosanquet-state', title='The Philosophical Theory of the State', author='Bernard Bosanquet',
        translator=None, year='1899', category='modern',
        description="Bosanquet's idealist political philosophy defending the state as moral community."
    ),
    TextConfig(
        gutenberg_id=63598, id='bosanquet-logic', title='The Essentials of Logic', author='Bernard Bosanquet',
        translator=None, year='1895', category='modern',
        description="Bosanquet's accessible introduction to idealist logic and judgment."
    ),
    TextConfig(
        gutenberg_id=49228, id='brentano-right-wrong', title='The Origin of Our Knowledge of Right and Wrong', author='Franz Brentano',
        translator='Cecil Hague', year='1889', category='modern',
        description="Brentano's ethical theory grounding morality in emotive attitudes and intentionality."
    ),
]

VICTORIAN_ESSAYISTS = [
    TextConfig(
        gutenberg_id=77244, id='arnold-essays-criticism', title='Essays in Criticism', author='Matthew Arnold',
        translator=None, year='1865', category='modern',
        description="Arnold's influential literary criticism establishing the function of criticism at the present time."
    ),
    TextConfig(
        gutenberg_id=2940, id='huxley-evolution-ethics', title='Evolution and Ethics and Other Essays', author='Thomas Henry Huxley',
        translator=None, year='1893', category='modern',
        description="Huxley's lectures on evolutionary ethics and the cosmic versus ethical process."
    ),
    TextConfig(
        gutenberg_id=52344, id='huxley-science-culture', title='Science and Culture and Other Essays', author='Thomas Henry Huxley',
        translator=None, year='1881', category='modern',
        description="Huxley's essays defending scientific education and the scientific worldview."
    ),
    TextConfig(
        gutenberg_id=16729, id='huxley-lay-sermons', title='Lay Sermons, Addresses and Reviews', author='Thomas Henry Huxley',
        translator=None, year='1870', category='modern',
        description="Huxley's popular essays on science, education, and the improvement of natural knowledge."
    ),
    TextConfig(
        gutenberg_id=1051, id='carlyle-sartor', title='Sartor Resartus', author='Thomas Carlyle',
        translator=None, year='1833', category='modern',
        description="Carlyle's idiosyncratic philosophical work on clothes as symbols and the philosophy of life."
    ),
    TextConfig(
        gutenberg_id=26159, id='carlyle-past-present', title='Past and Present', author='Thomas Carlyle',
        translator=None, year='1843', category='modern',
        description="Carlyle's social criticism contrasting medieval community with industrial capitalism."
    ),
    TextConfig(
        gutenberg_id=1140, id='carlyle-pamphlets', title='Latter-Day Pamphlets', author='Thomas Carlyle',
        translator=None, year='1850', category='modern',
        description="Carlyle's polemical essays attacking democracy, philanthropy, and modern liberalism."
    ),
    TextConfig(
        gutenberg_id=3020, id='hazlitt-table-talk', title='Table Talk', author='William Hazlitt',
        translator=None, year='1821', category='modern',
        description="Hazlitt's brilliant essays on literature, art, and human nature."
    ),
    TextConfig(
        gutenberg_id=4037, id='pater-appreciations', title='Appreciations, with an Essay on Style', author='Walter Pater',
        translator=None, year='1889', category='modern',
        description="Pater's aesthetic criticism on Wordsworth, Coleridge, Lamb, and the nature of literary style."
    ),
    TextConfig(
        gutenberg_id=4035, id='pater-greek-studies', title='Greek Studies', author='Walter Pater',
        translator=None, year='1895', category='modern',
        description="Pater's essays on Greek religion, myth, and art as expressions of aesthetic culture."
    ),
]

BURKE = [
    TextConfig(
        gutenberg_id=15043, id='burke-works-1', title='The Works of Edmund Burke, Volume 1', author='Edmund Burke',
        translator=None, year='Various', category='enlightenment',
        description="Burke's collected works including speeches on American taxation and conciliation."
    ),
    TextConfig(
        gutenberg_id=15198, id='burke-works-2', title='The Works of Edmund Burke, Volume 2', author='Edmund Burke',
        translator=None, year='Various', category='enlightenment',
        description="Burke's works on the French Revolution and political philosophy."
    ),
    TextConfig(
        gutenberg_id=15679, id='burke-works-3', title='The Works of Edmund Burke, Volume 3', author='Edmund Burke',
        translator=None, year='Various', category='enlightenment',
        description="Burke's works including speeches on India and the impeachment of Warren Hastings."
    ),
    TextConfig(
        gutenberg_id=15700, id='burke-works-4', title='The Works of Edmund Burke, Volume 4', author='Edmund Burke',
        translator=None, year='Various', category='enlightenment',
        description="Burke's works on Ireland and parliamentary reform."
    ),
    TextConfig(
        gutenberg_id=15701, id='burke-works-5', title='The Works of Edmund Burke, Volume 5', author='Edmund Burke',
        translator=None, year='Various', category='enlightenment',
        description="Burke's works including correspondence and biographical materials."
    ),
    TextConfig(
        gutenberg_id=2173, id='burke-discontents', title='Thoughts on the Cause of the Present Discontents', author='Edmund Burke',
        translator=None, year='1770', category='enlightenment',
        description="Burke's defense of party politics and criticism of royal influence on Parliament."
    ),
]

AESTHETICS = [
    TextConfig(
        gutenberg_id=6798, id='schiller-aesthetical', title='Aesthetical Essays', author='Friedrich Schiller',
        translator=None, year='Various', category='modern',
        description="Schiller's essays on aesthetic education and the harmony of sense and reason."
    ),
    TextConfig(
        gutenberg_id=73078, id='lessing-laocoon', title='Laocoon: An Essay on the Limits of Painting and Poetry', author='Gotthold Ephraim Lessing',
        translator='Ellen Frothingham', year='1766', category='enlightenment',
        description="Lessing's influential analysis distinguishing the proper domains of visual and literary arts."
    ),
    TextConfig(
        gutenberg_id=64908, id='tolstoy-what-is-art', title='What is Art?', author='Leo Tolstoy',
        translator='Aylmer Maude', year='1897', category='modern',
        description="Tolstoy's radical critique of aestheticism, arguing art should unite humanity through sincere emotion."
    ),
]

SPENCER_COMPLETE = [
    TextConfig(
        gutenberg_id=29869, id='spencer-essays-1', title='Essays: Scientific, Political, and Speculative, Volume 1', author='Herbert Spencer',
        translator=None, year='1858', category='modern',
        description="Spencer's essays on evolution, psychology, and the philosophy of science."
    ),
    TextConfig(
        gutenberg_id=53395, id='spencer-essays-2', title='Essays: Scientific, Political, and Speculative, Volume 2', author='Herbert Spencer',
        translator=None, year='1863', category='modern',
        description="Spencer's essays on social evolution, morality, and political philosophy."
    ),
    TextConfig(
        gutenberg_id=54076, id='spencer-essays-3', title='Essays: Scientific, Political, and Speculative, Volume 3', author='Herbert Spencer',
        translator=None, year='1874', category='modern',
        description="Spencer's later essays on ethics, sociology, and the limits of state action."
    ),
    TextConfig(
        gutenberg_id=16510, id='spencer-education', title='Essays on Education and Kindred Subjects', author='Herbert Spencer',
        translator=None, year='1861', category='modern',
        description="Spencer's influential essays on intellectual, moral, and physical education."
    ),
    TextConfig(
        gutenberg_id=5849, id='spencer-style', title='The Philosophy of Style', author='Herbert Spencer',
        translator=None, year='1852', category='modern',
        description="Spencer's essay analyzing the principles of effective writing and communication."
    ),
    TextConfig(
        gutenberg_id=46129, id='spencer-data-ethics', title='The Data of Ethics', author='Herbert Spencer',
        translator=None, year='1879', category='modern',
        description="Spencer's evolutionary ethics deriving moral principles from biological and social evolution."
    ),
]

CROCE = [
    TextConfig(
        gutenberg_id=54618, id='croce-aesthetic', title='Aesthetic as Science of Expression and General Linguistic', author='Benedetto Croce',
        translator='Douglas Ainslie', year='1902', category='modern',
        description="Croce's foundational work on aesthetics, identifying art with intuitive expression."
    ),
    TextConfig(
        gutenberg_id=52814, id='croce-vico', title='The Philosophy of Giambattista Vico', author='Benedetto Croce',
        translator='R. G. Collingwood', year='1911', category='modern',
        description="Croce's interpretation of Vico as the founder of the philosophy of history."
    ),
    TextConfig(
        gutenberg_id=54642, id='croce-historiography', title='Theory and History of Historiography', author='Benedetto Croce',
        translator='Douglas Ainslie', year='1917', category='modern',
        description="Croce's philosophy of history arguing all history is contemporary history."
    ),
    TextConfig(
        gutenberg_id=54137, id='croce-logic', title='Logic as the Science of the Pure Concept', author='Benedetto Croce',
        translator='Douglas Ainslie', year='1909', category='modern',
        description="Croce's idealist logic identifying concepts with the development of spirit."
    ),
    TextConfig(
        gutenberg_id=54938, id='croce-practical', title='Philosophy of the Practical', author='Benedetto Croce',
        translator='Douglas Ainslie', year='1909', category='modern',
        description="Croce's philosophy of economics and ethics as forms of practical activity."
    ),
]

POLITICAL_ECONOMIC = [
    TextConfig(
        gutenberg_id=61, id='communist-manifesto', title='The Communist Manifesto', author='Karl Marx and Friedrich Engels',
        translator='Samuel Moore', year='1848', category='modern',
        description="'Workers of the world, unite!' The founding document of modern communism analyzing class struggle."
    ),
    TextConfig(
        gutenberg_id=360, id='what-is-property', title='What is Property?', author='Pierre-Joseph Proudhon',
        translator='Benjamin Tucker', year='1840', category='modern',
        description="'Property is theft!' Proudhon's anarchist critique of private property and advocacy of mutualism."
    ),
    TextConfig(
        gutenberg_id=815, id='democracy-in-america', title='Democracy in America', author='Alexis de Tocqueville',
        translator='Henry Reeve', year='1835', category='modern',
        description="Tocqueville's classic analysis of American democracy, equality, and the dangers of democratic tyranny.",
        structure_depth=2  # Parse CHAPTER within BOOK
    ),
    TextConfig(
        gutenberg_id=39257, id='socialism-utopian-scientific', title='Socialism: Utopian and Scientific', author='Friedrich Engels',
        translator='Edward Aveling', year='1880', category='modern',
        description="Engels' accessible introduction to scientific socialism, contrasting it with earlier utopian movements."
    ),
    TextConfig(
        gutenberg_id=3420, id='vindication-rights-woman', title='A Vindication of the Rights of Woman', author='Mary Wollstonecraft',
        translator=None, year='1792', category='enlightenment',
        description="Wollstonecraft's pioneering feminist argument for women's education and equality, a founding text of feminism."
    ),
    TextConfig(
        gutenberg_id=36568, id='god-and-the-state', title='God and the State', author='Mikhail Bakunin',
        translator='Benjamin Tucker', year='1882', category='modern',
        description="Bakunin's anarchist critique of religion and the state as interconnected systems of oppression."
    ),
    TextConfig(
        gutenberg_id=4341, id='mutual-aid', title='Mutual Aid: A Factor of Evolution', author='Peter Kropotkin',
        translator=None, year='1902', category='modern',
        description="Kropotkin's argument that cooperation, not competition, is the key factor in evolution and human progress."
    ),
    TextConfig(
        gutenberg_id=23428, id='conquest-of-bread', title='The Conquest of Bread', author='Peter Kropotkin',
        translator=None, year='1892', category='modern',
        description="Kropotkin's vision of anarchist communism, outlining how a society without government could function."
    ),
    TextConfig(
        gutenberg_id=34580, id='ego-and-its-own', title='The Ego and Its Own', author='Max Stirner',
        translator='Steven T. Byington', year='1844', category='modern',
        description="Stirner's radical individualist philosophy rejecting all higher powers, states, and abstract ideals."
    ),
    TextConfig(
        gutenberg_id=47025, id='essence-of-christianity', title='The Essence of Christianity', author='Ludwig Feuerbach',
        translator='George Eliot', year='1841', category='modern',
        description="Feuerbach's influential critique arguing that God is a projection of human nature and desires."
    ),
    TextConfig(
        gutenberg_id=53799, id='general-view-positivism', title='A General View of Positivism', author='Auguste Comte',
        translator='J. H. Bridges', year='1848', category='modern',
        description="Comte's accessible summary of positivism: the religion of humanity and worship of science as the pinnacle of progress."
    ),
]

AMERICAN_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=16643, id='essays-emerson', title='Essays', author='Ralph Waldo Emerson',
        translator=None, year='1841', category='modern',
        description="Emerson's transcendentalist essays including 'Self-Reliance,' 'The Over-Soul,' and 'Circles.'"
    ),
    TextConfig(
        gutenberg_id=29433, id='emerson-nature', title='Nature', author='Ralph Waldo Emerson',
        translator=None, year='1836', category='modern',
        description="Emerson's foundational transcendentalist essay on nature, spirit, and the correspondence between mind and world."
    ),
    TextConfig(
        gutenberg_id=2944, id='emerson-essays-1', title='Essays: First Series', author='Ralph Waldo Emerson',
        translator=None, year='1841', category='modern',
        description="Emerson's first essay collection including Self-Reliance, Compensation, and Spiritual Laws."
    ),
    TextConfig(
        gutenberg_id=2945, id='emerson-essays-2', title='Essays: Second Series', author='Ralph Waldo Emerson',
        translator=None, year='1844', category='modern',
        description="Emerson's second collection including The Poet, Experience, and Manners."
    ),
    TextConfig(
        gutenberg_id=39827, id='emerson-conduct-life', title='The Conduct of Life', author='Ralph Waldo Emerson',
        translator=None, year='1860', category='modern',
        description="Emerson's mature wisdom on fate, power, wealth, culture, and behavior."
    ),
    TextConfig(
        gutenberg_id=69258, id='emerson-society-solitude', title='Society and Solitude', author='Ralph Waldo Emerson',
        translator=None, year='1870', category='modern',
        description="Emerson's late essays on domestic life, books, eloquence, and the balance of society and solitude."
    ),
    TextConfig(
        gutenberg_id=6312, id='emerson-representative-men', title='Representative Men', author='Ralph Waldo Emerson',
        translator=None, year='1850', category='modern',
        description="Emerson's lectures on Plato, Swedenborg, Montaigne, Shakespeare, Napoleon, and Goethe."
    ),
    TextConfig(
        gutenberg_id=205, id='walden', title='Walden', author='Henry David Thoreau',
        translator=None, year='1854', category='modern',
        description="Thoreau's transcendentalist masterpiece on simple living, self-reliance, and communion with nature."
    ),
    TextConfig(
        gutenberg_id=71, id='civil-disobedience', title='On the Duty of Civil Disobedience', author='Henry David Thoreau',
        translator=None, year='1849', category='modern',
        description="Thoreau's influential essay on resistance to unjust government, inspiring Gandhi and MLK."
    ),
    TextConfig(
        gutenberg_id=1022, id='thoreau-walking', title='Walking', author='Henry David Thoreau',
        translator=None, year='1862', category='modern',
        description="Thoreau's essay celebrating wildness and the art of walking as spiritual practice."
    ),
    TextConfig(
        gutenberg_id=42500, id='thoreau-maine-woods', title='The Maine Woods', author='Henry David Thoreau',
        translator=None, year='1864', category='modern',
        description="Thoreau's account of three journeys into the Maine wilderness, exploring nature and Native American life."
    ),
    TextConfig(
        gutenberg_id=34392, id='thoreau-cape-cod', title='Cape Cod', author='Henry David Thoreau',
        translator=None, year='1865', category='modern',
        description="Thoreau's observations on Cape Cod's landscape, history, and people."
    ),
    TextConfig(
        gutenberg_id=4232, id='thoreau-week-concord', title='A Week on the Concord and Merrimack Rivers', author='Henry David Thoreau',
        translator=None, year='1849', category='modern',
        description="Thoreau's first book, a blend of travel narrative, natural history, and philosophy."
    ),
    TextConfig(
        gutenberg_id=5116, id='pragmatism', title='Pragmatism', author='William James',
        translator=None, year='1907', category='modern',
        description="James's accessible introduction to pragmatism as a method and theory of truth."
    ),
    TextConfig(
        gutenberg_id=621, id='varieties-of-religious-experience', title='The Varieties of Religious Experience', author='William James',
        translator=None, year='1902', category='modern',
        description="James's empirical study of religious experience, examining mysticism, conversion, and saintliness."
    ),
    TextConfig(
        gutenberg_id=852, id='democracy-and-education', title='Democracy and Education', author='John Dewey',
        translator=None, year='1916', category='modern',
        description="Dewey's influential philosophy of education connecting learning to democratic participation and social growth."
    ),
    TextConfig(
        gutenberg_id=15000, id='life-of-reason', title='The Life of Reason', author='George Santayana',
        translator=None, year='1905', category='modern',
        description="Santayana's naturalistic philosophy examining reason's role in common sense, society, religion, art, and science."
    ),
    TextConfig(
        gutenberg_id=26659, id='james-will-to-believe', title='The Will to Believe', author='William James',
        translator=None, year='1896', category='modern',
        description="James's essays defending the right to believe in the absence of decisive evidence."
    ),
    TextConfig(
        gutenberg_id=33677, id='royce-religious-insight', title='The Sources of Religious Insight', author='Josiah Royce',
        translator=None, year='1912', category='modern',
        description="Royce's lectures on the psychology and philosophy of religious experience."
    ),
    TextConfig(
        gutenberg_id=26842, id='santayana-sense-beauty', title='The Sense of Beauty', author='George Santayana',
        translator=None, year='1896', category='modern',
        description="Santayana's aesthetic theory defining beauty as objectified pleasure."
    ),
    TextConfig(
        gutenberg_id=35612, id='santayana-three-poets', title='Three Philosophical Poets', author='George Santayana',
        translator=None, year='1910', category='modern',
        description="Santayana's literary-philosophical study of Lucretius, Dante, and Goethe."
    ),
    TextConfig(
        gutenberg_id=48429, id='santayana-soliloquies', title='Soliloquies in England', author='George Santayana',
        translator=None, year='1922', category='modern',
        description="Santayana's reflections on English culture, democracy, and the spiritual life."
    ),
    TextConfig(
        gutenberg_id=34654, id='santayana-character-opinion', title='Character and Opinion in the United States', author='George Santayana',
        translator=None, year='1920', category='modern',
        description="Santayana's cultural criticism of American intellectual and social life."
    ),
    TextConfig(
        gutenberg_id=65274, id='chance-love-and-logic', title='Chance, Love, and Logic', author='Charles Sanders Peirce',
        translator=None, year='1923', category='modern',
        description="Essays by the founder of pragmatism, exploring chance, evolution, logic, and the scientific method."
    ),
    TextConfig(
        gutenberg_id=57628, id='principles-of-psychology-vol-1', title='The Principles of Psychology, Vol. 1', author='William James',
        translator=None, year='1890', category='modern',
        description="James's groundbreaking work in psychology examining consciousness, habit, emotion, and the stream of thought."
    ),
    TextConfig(
        gutenberg_id=57634, id='principles-of-psychology-vol-2', title='The Principles of Psychology, Vol. 2', author='William James',
        translator=None, year='1890', category='modern',
        description="The second volume of James's psychology, covering sensation, perception, reasoning, and the will."
    ),
]

# =============================================================================
# CHINESE PHILOSOPHY
# =============================================================================

TAOIST = [
    TextConfig(
        gutenberg_id=216, id='tao-te-ching', title='Tao Te Ching', author='Lao Tzu',
        translator='James Legge', year='c. 6th century BCE', category='chinese',
        description="The foundational text of Taoism on the Way (Tao), virtue, and living in harmony with nature's flow."
    ),
    TextConfig(
        gutenberg_id=59709, id='chuang-tzu', title='Chuang Tzu: Mystic, Moralist, and Social Reformer', author='Zhuangzi',
        translator='Herbert Giles', year='c. 3rd century BCE', category='chinese',
        description="Parables and philosophy of the great Taoist sage, exploring freedom, spontaneity, and the relativity of perspectives."
    ),
]

CONFUCIAN = [
    TextConfig(
        gutenberg_id=3330, id='analects', title='The Analects', author='Confucius',
        translator='James Legge', year='c. 5th century BCE', category='chinese',
        description="The collected sayings of Confucius on virtue, ritual, governance, and the cultivation of moral character."
    ),
    TextConfig(
        gutenberg_id=46389, id='sayings-of-confucius', title='The Sayings of Confucius', author='Confucius',
        translator='Leonard A. Lyall', year='c. 5th century BCE', category='chinese',
        description="An accessible translation of Confucius's teachings on ethics, learning, and social harmony."
    ),
    TextConfig(
        gutenberg_id=33815, id='wisdom-of-confucius', title='The Wisdom of Confucius', author='Confucius',
        translator='Lin Yutang', year='c. 5th century BCE', category='chinese',
        description="Lin Yutang's compilation presenting Confucius's philosophy on the art of living and moral cultivation."
    ),
    TextConfig(
        gutenberg_id=75878, id='book-of-filial-duty', title='The Book of Filial Duty', author='Zengzi',
        translator='Ivan Chen', year='c. 4th century BCE', category='chinese',
        description="The Classic of Filial Piety, a foundational Confucian text on the virtue of respect for parents and ancestors."
    ),
    TextConfig(
        gutenberg_id=3100, id='chinese-classics', title='The Chinese Classics', author='Various',
        translator='James Legge', year='various', category='chinese',
        description="Legge's comprehensive translation of the Four Books and Five Classics of Confucian philosophy."
    ),
    TextConfig(
        gutenberg_id=25142, id='wang-yangming-works', title='The Philosophy of Wang Yang-ming', author='Wang Yangming',
        translator='Frederick Goodrich Henke', year='c. 1520', category='chinese',
        description="Wang Yangming's Neo-Confucian philosophy emphasizing innate moral knowledge and unity of knowledge and action."
    ),
    TextConfig(
        gutenberg_id=25517, id='wang-yangming-instructions', title='Instructions for Practical Living', author='Wang Yangming',
        translator='Wing-tsit Chan', year='c. 1520', category='chinese',
        description="Wang Yangming's teachings on moral cultivation and the extension of innate knowledge."
    ),
    TextConfig(
        gutenberg_id=24178, id='mencius', title='The Works of Mencius', author='Mencius',
        translator='James Legge', year='c. 300 BCE', category='chinese',
        description="Mencius's development of Confucian philosophy, arguing for innate human goodness."
    ),
    TextConfig(
        gutenberg_id=25314, id='xunzi', title='The Works of Hsüntze', author='Xunzi',
        translator='Homer H. Dubs', year='c. 250 BCE', category='chinese',
        description="Xunzi's Confucian philosophy arguing humans are naturally selfish and require cultivation."
    ),
    TextConfig(
        gutenberg_id=24240, id='mozi', title='The Ethical and Political Works of Motse', author='Mozi',
        translator='Yi-pao Mei', year='c. 400 BCE', category='chinese',
        description="Mozi's universal love, anti-war philosophy, and utilitarian ethics critiquing Confucian ritual."
    ),
    TextConfig(
        gutenberg_id=24049, id='han-feizi', title='The Complete Works of Han Fei Tzu', author='Han Feizi',
        translator='W. K. Liao', year='c. 230 BCE', category='chinese',
        description="Han Feizi's Legalist political philosophy emphasizing law, technique, and authority."
    ),
    TextConfig(
        gutenberg_id=7341, id='liezi', title='Lieh-tzu', author='Liezi',
        translator='Lionel Giles', year='c. 400 BCE', category='chinese',
        description="The Taoist classic on fate, destiny, and living in harmony with the natural order."
    ),
]

CHINESE_MILITARY = [
    TextConfig(
        gutenberg_id=132, id='art-of-war', title='The Art of War', author='Sun Tzu',
        translator='Lionel Giles', year='c. 5th century BCE', category='chinese',
        description="The ancient Chinese treatise on military strategy, widely applied to business, politics, and personal conflict."
    ),
    TextConfig(
        gutenberg_id=44024, id='book-of-war', title='The Book of War', author='Sun Tzu and Wu Chi',
        translator='E. F. Calthrop', year='c. 5th century BCE', category='chinese',
        description="The military classics of the Far East, combining Sun Tzu's Art of War with Wu Chi's complementary treatise."
    ),
]

# =============================================================================
# INDIAN PHILOSOPHY
# =============================================================================

HINDU_CLASSICAL = [
    TextConfig(
        gutenberg_id=2388, id='bhagavad-gita', title='The Bhagavad Gita', author='Vyasa',
        translator='Edwin Arnold', year='c. 2nd century BCE', category='indian',
        description="The 'Song of God' from the Mahabharata: Krishna's teachings on duty, devotion, knowledge, and action.",
        strip_end_markers=True  # Remove "HERE ENDETH CHAPTER" markers
    ),
    TextConfig(
        gutenberg_id=3283, id='upanishads', title='The Upanishads', author='Various',
        translator='Max Müller', year='c. 800-200 BCE', category='indian',
        description="The philosophical culmination of the Vedas, exploring Brahman, Atman, and the nature of ultimate reality."
    ),
    TextConfig(
        gutenberg_id=16295, id='vedanta-sutras-shankara', title='Vedanta-Sutras with Shankara\'s Commentary', author='Badarayana',
        translator='George Thibaut', year='c. 2nd century BCE', category='indian',
        description="The foundational text of Vedanta with Shankara's Advaita (non-dual) commentary on Brahman and liberation."
    ),
    TextConfig(
        gutenberg_id=7297, id='vedanta-sutras-ramanuja', title='Vedanta-Sutras with Ramanuja\'s Commentary', author='Badarayana',
        translator='George Thibaut', year='c. 2nd century BCE', category='indian',
        description="The Vedanta-Sutras with Ramanuja's Vishishtadvaita (qualified non-dualism) interpretation."
    ),
    TextConfig(
        gutenberg_id=2526, id='yoga-sutras', title='The Yoga Sutras of Patanjali', author='Patanjali',
        translator='Charles Johnston', year='c. 2nd century BCE', category='indian',
        description="The classical text of yoga philosophy, outlining the eight limbs of yoga and the path to liberation."
    ),
]

INDIAN_EPICS = [
    TextConfig(
        gutenberg_id=24869, id='ramayana', title='The Ramayana', author='Valmiki',
        translator='Ralph T. H. Griffith', year='c. 5th century BCE', category='indian',
        description="The epic tale of Rama's journey, exploring dharma, devotion, and the triumph of good over evil."
    ),
    TextConfig(
        gutenberg_id=15474, id='mahabharata-vol-1', title='The Mahabharata, Volume 1', author='Vyasa',
        translator='Kisari Mohan Ganguli', year='c. 4th century BCE', category='indian',
        description="The first volume of the world's longest epic poem, encompassing philosophy, mythology, and the Bhagavad Gita."
    ),
    TextConfig(
        gutenberg_id=15475, id='mahabharata-vol-2', title='The Mahabharata, Volume 2', author='Vyasa',
        translator='Kisari Mohan Ganguli', year='c. 4th century BCE', category='indian',
        description="The second volume of the Mahabharata, continuing the saga of the Pandavas and Kauravas."
    ),
    TextConfig(
        gutenberg_id=15476, id='mahabharata-vol-3', title='The Mahabharata, Volume 3', author='Vyasa',
        translator='Kisari Mohan Ganguli', year='c. 4th century BCE', category='indian',
        description="The third volume of the Mahabharata, including the great battle of Kurukshetra."
    ),
    TextConfig(
        gutenberg_id=15477, id='mahabharata-vol-4', title='The Mahabharata, Volume 4', author='Vyasa',
        translator='Kisari Mohan Ganguli', year='c. 4th century BCE', category='indian',
        description="The fourth volume of the Mahabharata, concluding the epic with reflections on dharma and moksha."
    ),
]

INDIAN_MODERN = [
    TextConfig(
        gutenberg_id=72368, id='jnana-yoga', title='Jnana Yoga', author='Swami Vivekananda',
        translator=None, year='1899', category='indian',
        description="Vivekananda's lectures on the path of knowledge, exploring Vedanta philosophy and the nature of the Self."
    ),
    TextConfig(
        gutenberg_id=6842, id='sadhana', title='Sadhana: The Realisation of Life', author='Rabindranath Tagore',
        translator=None, year='1913', category='indian',
        description="The Nobel laureate's philosophical essays on the soul, nature, and the realization of the infinite in daily life."
    ),
    TextConfig(
        gutenberg_id=7164, id='gitanjali', title='Gitanjali', author='Rabindranath Tagore',
        translator=None, year='1912', category='indian',
        description="'Song Offerings' - Tagore's Nobel Prize-winning collection of devotional poetry on the divine presence."
    ),
    TextConfig(
        gutenberg_id=23136, id='creative-unity', title='Creative Unity', author='Rabindranath Tagore',
        translator=None, year='1922', category='indian',
        description="Tagore's essays on the unity underlying creation, art, and human civilization."
    ),
    TextConfig(
        gutenberg_id=40766, id='nationalism', title='Nationalism', author='Rabindranath Tagore',
        translator=None, year='1917', category='indian',
        description="Tagore's critique of aggressive nationalism and vision of universal humanity transcending borders."
    ),
    TextConfig(
        gutenberg_id=40461, id='hind-swaraj', title='Hind Swaraj (Indian Home Rule)', author='Mahatma Gandhi',
        translator=None, year='1909', category='indian',
        description="Gandhi's foundational text on Indian self-rule, non-violence, and the critique of modern civilization."
    ),
    TextConfig(
        gutenberg_id=10366, id='freedoms-battle', title='Freedom\'s Battle', author='Mahatma Gandhi',
        translator=None, year='1922', category='indian',
        description="Gandhi's essays on non-violent resistance, swaraj, and the struggle for Indian independence."
    ),
    TextConfig(
        gutenberg_id=6519, id='songs-of-kabir', title='Songs of Kabir', author='Kabir',
        translator='Rabindranath Tagore', year='c. 15th century', category='indian',
        description="The mystical poetry of Kabir, weaving Hindu and Islamic devotion into songs of divine love and inner truth."
    ),
    TextConfig(
        gutenberg_id=12956, id='history-indian-philosophy', title='A History of Indian Philosophy, Vol. 1', author='Surendranath Dasgupta',
        translator=None, year='1922', category='indian',
        description="A comprehensive scholarly survey of Indian philosophical systems from the Vedas to the classical schools."
    ),
]

INDIAN_LITERATURE = [
    TextConfig(
        gutenberg_id=16659, id='shakuntala', title='Shakuntala and Other Works', author='Kalidasa',
        translator='Arthur W. Ryder', year='c. 4th century CE', category='indian',
        description="The masterworks of Sanskrit's greatest poet, including the famous drama Shakuntala on love and fate."
    ),
    TextConfig(
        gutenberg_id=31968, id='birth-of-war-god', title='The Birth of the War-God', author='Kalidasa',
        translator='Ralph T. H. Griffith', year='c. 4th century CE', category='indian',
        description="Kalidasa's epic poem Kumarasambhava on the divine marriage of Shiva and Parvati."
    ),
]

# =============================================================================
# BUDDHIST PHILOSOPHY
# =============================================================================

BUDDHIST_THERAVADA = [
    TextConfig(
        gutenberg_id=2017, id='dhammapada', title='The Dhammapada', author='Buddha',
        translator='Max Müller', year='c. 3rd century BCE', category='buddhist',
        description="The most famous collection of Buddha's sayings in verse: the path of truth and the cultivation of mindfulness."
    ),
    TextConfig(
        gutenberg_id=35185, id='buddhas-path-of-virtue', title='The Buddha\'s Path of Virtue', author='Buddha',
        translator='F. L. Woodward', year='c. 3rd century BCE', category='buddhist',
        description="An alternative translation of the Dhammapada emphasizing practical wisdom for ethical living."
    ),
    TextConfig(
        gutenberg_id=51880, id='jataka-tales', title='Buddhist Birth Stories (Jataka Tales)', author='Various',
        translator='T. W. Rhys Davids', year='c. 3rd century BCE', category='buddhist',
        description="Stories of Buddha's previous lives, teaching moral lessons through engaging narratives."
    ),
    TextConfig(
        gutenberg_id=46984, id='jatakamala', title='The Jatakamala', author='Aryasura',
        translator='J. S. Speyer', year='c. 4th century CE', category='buddhist',
        description="The Garland of Birth Stories - elegant Sanskrit retellings of Buddha's previous lives."
    ),
]

BUDDHIST_ZEN = [
    TextConfig(
        gutenberg_id=71157, id='essays-in-zen-buddhism', title='Essays in Zen Buddhism: First Series', author='D. T. Suzuki',
        translator=None, year='1927', category='buddhist',
        description="The foundational introduction to Zen Buddhism for the West, exploring satori, koans, and enlightenment."
    ),
    TextConfig(
        gutenberg_id=5173, id='religion-of-the-samurai', title='The Religion of the Samurai', author='Kaiten Nukariya',
        translator=None, year='1913', category='buddhist',
        description="Zen Buddhism's influence on Japanese warrior culture, exploring meditation, discipline, and enlightenment."
    ),
    TextConfig(
        gutenberg_id=34325, id='zen-experience', title='The Zen Experience', author='Thomas Hoover',
        translator=None, year='1980', category='buddhist',
        description="A comprehensive introduction to Zen history, practice, and philosophy from China to Japan."
    ),
    TextConfig(
        gutenberg_id=43273, id='zen-and-art', title='Zen Buddhism and Its Relation to Art', author='Arthur Waley',
        translator=None, year='1922', category='buddhist',
        description="Explores how Zen principles shaped Japanese aesthetics in painting, poetry, and tea ceremony."
    ),
    TextConfig(
        gutenberg_id=7015, id='buddhist-psalms', title='Buddhist Psalms', author='Shinran Shonin',
        translator='S. Yamabe and L. Adams Beck', year='c. 13th century', category='buddhist',
        description="Devotional poems from the founder of Pure Land Buddhism, expressing faith in Amida Buddha's compassion."
    ),
]

BUDDHIST_STUDIES = [
    TextConfig(
        gutenberg_id=55681, id='gleanings-in-buddha-fields', title='Gleanings in Buddha-Fields', author='Lafcadio Hearn',
        translator=None, year='1897', category='buddhist',
        description="Hearn's observations on Buddhist culture in Japan: temples, beliefs, and the spiritual landscape."
    ),
]

# =============================================================================
# PERSIAN / SUFI PHILOSOPHY
# =============================================================================

SUFI = [
    TextConfig(
        gutenberg_id=246, id='rubaiyat', title='The Rubaiyat of Omar Khayyam', author='Omar Khayyam',
        translator='Edward FitzGerald', year='c. 11th century', category='sufi',
        description="The beloved quatrains on mortality, wine, and cosmic mystery that captivated the Victorian world."
    ),
    TextConfig(
        gutenberg_id=38511, id='sufistic-quatrains', title='The Sufistic Quatrains of Omar Khayyam', author='Omar Khayyam',
        translator='Robert Arnot', year='c. 11th century', category='sufi',
        description="A translation emphasizing the mystical Sufi dimensions of Khayyam's poetry."
    ),
    TextConfig(
        gutenberg_id=50619, id='sufism-of-rubaiyat', title='The Sufism of the Rubaiyat', author='Omar Khayyam',
        translator='Paramahansa Yogananda', year='c. 11th century', category='sufi',
        description="Yogananda's spiritual commentary revealing the esoteric meaning hidden in Khayyam's verses."
    ),
    TextConfig(
        gutenberg_id=45159, id='persian-mystics-rumi', title='The Persian Mystics: Rumi', author='Jalal al-Din Rumi',
        translator='F. Hadland Davis', year='c. 13th century', category='sufi',
        description="Selected poems and teachings of the great Sufi master on divine love and spiritual union."
    ),
    TextConfig(
        gutenberg_id=57068, id='festival-of-spring', title='The Festival of Spring', author='Jalal al-Din Rumi',
        translator='Richard Jeffrey Newman', year='c. 13th century', category='sufi',
        description="Poems from Rumi's Divan celebrating spiritual awakening, love, and the dance of the soul."
    ),
    TextConfig(
        gutenberg_id=74883, id='poems-from-divan-of-hafiz', title='Poems from the Divan of Hafiz', author='Hafiz',
        translator='Gertrude Bell', year='c. 14th century', category='sufi',
        description="The lyrical poetry of Persia's most beloved poet on love, wine, and the spiritual tavern."
    ),
    TextConfig(
        gutenberg_id=77453, id='songs-of-hafiz', title='Songs of Hafiz', author='Hafiz',
        translator='Various', year='c. 14th century', category='sufi',
        description="Hafiz's ghazals on divine intoxication, the beloved, and the Sufi path of the heart."
    ),
    TextConfig(
        gutenberg_id=10315, id='persian-literature-vol-1', title='Persian Literature, Volume 1', author='Various',
        translator='Various', year='various', category='sufi',
        description="Anthology including the Shah Nameh, Rubaiyat, Divan, and Gulistan - treasures of Persian wisdom."
    ),
    TextConfig(
        gutenberg_id=13060, id='persian-literature-vol-2', title='Persian Literature, Volume 2', author='Various',
        translator='Various', year='various', category='sufi',
        description="Continuation of Persian classics including Saadi's Gulistan on practical wisdom and ethics."
    ),
]

ISLAMIC_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=58186, id='compendium-on-soul-avicenna', title='A Compendium on the Soul', author='Avicenna (Ibn Sina)',
        translator='Edward Abbott van Dyck', year='c. 11th century', category='sufi',
        description="The great Islamic philosopher's treatise on psychology, consciousness, and the nature of the soul."
    ),
    TextConfig(
        gutenberg_id=65708, id='averroes-philosophy', title='Averroes: Philosophy and Theology of Averroes', author='Averroes (Ibn Rushd)',
        translator='Mohammad Jamil-ur-Rehman', year='c. 1180', category='medieval',
        description="Averroes on the harmony between philosophy and Islamic theology, influential for medieval Scholasticism."
    ),
    TextConfig(
        gutenberg_id=58977, id='ghazali-confessions', title="Al-Ghazali's Confessions", author='Al-Ghazali',
        translator='Claud Field', year='c. 1100', category='medieval',
        description="Al-Ghazali's spiritual autobiography describing his crisis of faith and turn to Sufism."
    ),
    TextConfig(
        gutenberg_id=73140, id='ghazali-teachings', title='The Religious and Moral Teachings of Al-Ghazali', author='Al-Ghazali',
        translator='Syed Nawab Ali', year='c. 1100', category='medieval',
        description="Al-Ghazali's ethical teachings integrating Islamic law, philosophy, and Sufi spirituality."
    ),
    TextConfig(
        gutenberg_id=16831, id='ibn-tufail-reason', title='The Improvement of Human Reason', author='Ibn Tufail',
        translator='Simon Ockley', year='c. 1160', category='medieval',
        description="Philosophical novel about Hayy ibn Yaqzan discovering truth through reason alone on a deserted island."
    ),
    TextConfig(
        gutenberg_id=34572, id='ibn-tufail-awakening', title='The Awakening of the Soul', author='Ibn Tufail',
        translator='Paul Bronnle', year='c. 1160', category='medieval',
        description="Alternative translation of Ibn Tufail's philosophical tale of natural human enlightenment."
    ),
]

# =============================================================================
# COMPARATIVE / ANTHOLOGY
# =============================================================================

EASTERN_COMPARATIVE = [
    TextConfig(
        gutenberg_id=12894, id='sacred-books-of-east', title='Sacred Books of the East', author='Various',
        translator='Max Müller (ed.)', year='various', category='indian',
        description="Müller's landmark anthology of Eastern religious and philosophical texts from multiple traditions."
    ),
]

ESSAY_COLLECTIONS = [
    TextConfig(
        gutenberg_id=575, id='bacon-essays', title='The Essays or Counsels, Civil and Moral', author='Francis Bacon',
        translator=None, year='1625', category='enlightenment',
        description="Bacon's practical wisdom essays on truth, death, revenge, adversity, gardens, and studies."
    ),
    TextConfig(
        gutenberg_id=147, id='paine-common-sense', title='Common Sense', author='Thomas Paine',
        translator=None, year='1776', category='enlightenment',
        description="Paine's revolutionary pamphlet arguing for American independence from Britain."
    ),
    TextConfig(
        gutenberg_id=743, id='godwin-thoughts-man', title='Thoughts on Man', author='William Godwin',
        translator=None, year='1831', category='modern',
        description="Godwin's essays on human nature, politics, and society from the anarchist pioneer."
    ),
    TextConfig(
        gutenberg_id=73959, id='pascal-provincial-letters', title='The Provincial Letters', author='Blaise Pascal',
        translator="Thomas M'Crie", year='1656', category='enlightenment',
        description="Pascal's satirical attack on Jesuit casuistry, a masterpiece of French prose."
    ),
    # Removed: smith-essays (58559) - omnibus volume that duplicated Theory of Moral Sentiments
    # and had parsing issues. Individual essays to be added when available from clean sources.
]

WOMEN_PHILOSOPHERS = [
    TextConfig(
        gutenberg_id=73404, id='taylor-mill-enfranchisement', title='Enfranchisement of Women', author='Harriet Taylor Mill',
        translator=None, year='1851', category='modern',
        description="Harriet Taylor Mill's argument for women's political rights and economic independence."
    ),
]

REFERENCE_WORKS = [
    TextConfig(
        gutenberg_id=25009, id='worlds-greatest-philosophy', title="The World's Greatest Books: Philosophy and Economics", author='Various',
        translator=None, year='Various', category='modern',
        description="Anthology of summaries of major philosophical works for general readers."
    ),
]

SUFI_ADDITIONAL = [
    TextConfig(
        gutenberg_id=61724, id='rumi-mesnevi', title='The Mesnevi', author='Jalal al-Din Rumi',
        translator='E. H. Whinfield', year='c. 1260', category='sufi',
        description="Rumi's spiritual epic poem teaching Sufi wisdom through stories and parables."
    ),
]

# =============================================================================
# EARLY 20TH CENTURY / ANALYTIC PHILOSOPHY
# =============================================================================

RUSSELL = [
    TextConfig(
        gutenberg_id=5827, id='problems-of-philosophy', title='The Problems of Philosophy', author='Bertrand Russell',
        translator=None, year='1912', category='modern',
        description="Russell's accessible introduction to philosophy, exploring knowledge, reality, and the limits of philosophical inquiry."
    ),
    TextConfig(
        gutenberg_id=2529, id='analysis-of-mind', title='The Analysis of Mind', author='Bertrand Russell',
        translator=None, year='1921', category='modern',
        description="Russell's lectures exploring the nature of mind, consciousness, and the relationship between psychology and physics."
    ),
    TextConfig(
        gutenberg_id=25447, id='mysticism-and-logic', title='Mysticism and Logic', author='Bertrand Russell',
        translator=None, year='1918', category='modern',
        description="Essays contrasting mystical and scientific approaches to reality, including 'A Free Man's Worship.'"
    ),
    TextConfig(
        gutenberg_id=37090, id='knowledge-external-world', title='Our Knowledge of the External World', author='Bertrand Russell',
        translator=None, year='1914', category='modern',
        description="Russell applies logical analysis to epistemological problems, demonstrating the scientific method in philosophy."
    ),
    # NOTE: No plain text available - needs HTML/EPUB parsing
    # TextConfig(
    #     gutenberg_id=41654, id='intro-mathematical-philosophy', title='Introduction to Mathematical Philosophy', author='Bertrand Russell',
    #     translator=None, year='1919', category='modern',
    #     description="Russell's accessible explanation of the logical foundations of mathematics, written while imprisoned for pacifism."
    # ),
    TextConfig(
        gutenberg_id=690, id='proposed-roads-freedom', title='Proposed Roads to Freedom', author='Bertrand Russell',
        translator=None, year='1918', category='modern',
        description="Russell's comparative analysis of socialism, anarchism, and syndicalism as paths to social reform."
    ),
    TextConfig(
        gutenberg_id=4776, id='political-ideals', title='Political Ideals', author='Bertrand Russell',
        translator=None, year='1917', category='modern',
        description="Russell's vision for political and economic reform, emphasizing individual liberty and creative impulses."
    ),
    TextConfig(
        gutenberg_id=55610, id='why-men-fight', title='Why Men Fight', author='Bertrand Russell',
        translator=None, year='1917', category='modern',
        description="Russell's analysis of the psychological and social causes of war, written during World War I."
    ),
    TextConfig(
        gutenberg_id=73782, id='what-i-believe', title='What I Believe', author='Bertrand Russell',
        translator=None, year='1925', category='modern',
        description="Russell's concise statement of his philosophical and ethical views on life, morality, and human values."
    ),
    TextConfig(
        gutenberg_id=67104, id='abc-relativity', title='The A B C of Relativity', author='Bertrand Russell',
        translator=None, year='1925', category='modern',
        description="Russell's lucid explanation of Einstein's theory of relativity for general readers."
    ),
    TextConfig(
        gutenberg_id=77894, id='conquest-happiness', title='The Conquest of Happiness', author='Bertrand Russell',
        translator=None, year='1930', category='modern',
        description="Russell's practical philosophy for achieving happiness through engagement with life and overcoming self-absorption."
    ),
    TextConfig(
        gutenberg_id=44932, id='free-thought-propaganda', title='Free Thought and Official Propaganda', author='Bertrand Russell',
        translator=None, year='1922', category='modern',
        description="Russell's defense of free thought against propaganda, censorship, and institutional control of ideas."
    ),
    TextConfig(
        gutenberg_id=13940, id='problem-of-china', title='The Problem of China', author='Bertrand Russell',
        translator=None, year='1922', category='modern',
        description="Russell's analysis of Chinese civilization, politics, and the challenges of modernization after visiting China."
    ),
    TextConfig(
        gutenberg_id=17350, id='practice-theory-bolshevism', title='The Practice and Theory of Bolshevism', author='Bertrand Russell',
        translator=None, year='1920', category='modern',
        description="Russell's critical assessment of Soviet communism based on his visit to Russia, sympathetic yet honest."
    ),
    TextConfig(
        gutenberg_id=52091, id='foundations-geometry', title='An Essay on the Foundations of Geometry', author='Bertrand Russell',
        translator=None, year='1897', category='modern',
        description="Russell's early work examining the philosophical foundations of geometry and spatial reasoning."
    ),
    TextConfig(
        gutenberg_id=72981, id='philosophy-russell', title='Philosophy', author='Bertrand Russell',
        translator=None, year='1927', category='modern',
        description="Russell's overview of philosophy's nature, methods, and value for the general reader."
    ),
    TextConfig(
        gutenberg_id=70302, id='education-good-life', title='Education and the Good Life', author='Bertrand Russell',
        translator=None, year='1926', category='modern',
        description="Russell's philosophy of education, advocating for intellectual freedom and the development of character."
    ),
    TextConfig(
        gutenberg_id=66225, id='icarus', title='Icarus, or The Future of Science', author='Bertrand Russell',
        translator=None, year='1924', category='modern',
        description="Russell's warning about the dangers of scientific progress without ethical guidance."
    ),
    # NOTE: No plain text available - needs HTML/EPUB parsing
    # TextConfig(
    #     gutenberg_id=77427, id='analysis-matter', title='The Analysis of Matter', author='Bertrand Russell',
    #     translator=None, year='1927', category='modern',
    #     description="Russell's examination of the philosophical implications of modern physics for our understanding of matter."
    # ),
    # NOTE: No plain text available - needs HTML/EPUB parsing
    # TextConfig(
    #     gutenberg_id=72875, id='abc-atoms', title='The A B C of Atoms', author='Bertrand Russell',
    #     translator=None, year='1923', category='modern',
    #     description="Russell's accessible introduction to atomic theory and its philosophical implications."
    # ),
]

WITTGENSTEIN = [
    # NOTE: No plain text available - only PDF/TeX due to logical notation
    # TextConfig(
    #     gutenberg_id=5740, id='tractatus', title='Tractatus Logico-Philosophicus', author='Ludwig Wittgenstein',
    #     translator='C. K. Ogden', year='1921', category='modern',
    #     description="Wittgenstein's early masterwork on the limits of language, logic, and what can be said versus shown."
    # ),
]

MOORE = [
    TextConfig(
        gutenberg_id=53430, id='principia-ethica', title='Principia Ethica', author='G. E. Moore',
        translator=None, year='1903', category='modern',
        description="Moore's foundational work in analytic ethics, introducing the open question argument against naturalism."
    ),
    TextConfig(
        gutenberg_id=50141, id='philosophical-studies', title='Philosophical Studies', author='G. E. Moore',
        translator=None, year='1922', category='modern',
        description="Moore's collected essays on ethics, epistemology, and metaphysics, exemplifying analytic philosophy's methods."
    ),
]

WHITEHEAD = [
    TextConfig(
        gutenberg_id=68611, id='science-modern-world', title='Science and the Modern World', author='Alfred North Whitehead',
        translator=None, year='1925', category='modern',
        description="Whitehead's influential analysis of the rise of modern science and its impact on civilization."
    ),
    TextConfig(
        gutenberg_id=18835, id='concept-nature', title='The Concept of Nature', author='Alfred North Whitehead',
        translator=None, year='1920', category='modern',
        description="Whitehead's philosophy of nature, examining time, space, and the objects of scientific knowledge."
    ),
    # NOTE: No plain text available - needs HTML/EPUB parsing
    # TextConfig(
    #     gutenberg_id=71026, id='enquiry-natural-knowledge', title='An Enquiry Concerning the Principles of Natural Knowledge', author='Alfred North Whitehead',
    #     translator=None, year='1919', category='modern',
    #     description="Whitehead's technical investigation of the foundations of natural science and perception."
    # ),
    TextConfig(
        gutenberg_id=77011, id='organisation-thought', title='The Organisation of Thought', author='Alfred North Whitehead',
        translator=None, year='1917', category='modern',
        description="Whitehead's essays on education, logic, and the organization of scientific thinking."
    ),
]

BERGSON = [
    TextConfig(
        gutenberg_id=26163, id='creative-evolution', title='Creative Evolution', author='Henri Bergson',
        translator='Arthur Mitchell', year='1907', category='modern',
        description="Bergson's influential theory of the élan vital, critiquing mechanism and finalism in understanding life."
    ),
    TextConfig(
        gutenberg_id=56852, id='time-free-will', title='Time and Free Will', author='Henri Bergson',
        translator='F. L. Pogson', year='1889', category='modern',
        description="Bergson's doctoral thesis introducing the concept of duration and defending free will against determinism."
    ),
    TextConfig(
        gutenberg_id=4352, id='laughter', title='Laughter: An Essay on the Meaning of the Comic', author='Henri Bergson',
        translator='Cloudesley Brereton', year='1900', category='modern',
        description="Bergson's analysis of comedy and why we laugh, exploring the mechanical encrusted on the living."
    ),
    TextConfig(
        gutenberg_id=20842, id='dreams-bergson', title='Dreams', author='Henri Bergson',
        translator='Edwin E. Slosson', year='1914', category='modern',
        description="Bergson's exploration of dream states and their relation to memory and perception."
    ),
    TextConfig(
        gutenberg_id=17111, id='meaning-of-war', title='The Meaning of the War', author='Henri Bergson',
        translator=None, year='1915', category='modern',
        description="Bergson's philosophical interpretation of World War I as a conflict of cultures and ideals."
    ),
]

DEWEY_ADDITIONAL = [
    TextConfig(
        gutenberg_id=37423, id='how-we-think', title='How We Think', author='John Dewey',
        translator=None, year='1910', category='modern',
        description="Dewey's influential analysis of reflective thinking and its cultivation through education."
    ),
    TextConfig(
        gutenberg_id=41386, id='human-nature-conduct', title='Human Nature and Conduct', author='John Dewey',
        translator=None, year='1922', category='modern',
        description="Dewey's social psychology examining habit, impulse, and intelligence in human conduct."
    ),
    TextConfig(
        gutenberg_id=71000, id='public-problems', title='The Public and Its Problems', author='John Dewey',
        translator=None, year='1927', category='modern',
        description="Dewey's analysis of democracy, public discourse, and the conditions for effective political participation."
    ),
    TextConfig(
        gutenberg_id=40089, id='reconstruction-philosophy', title='Reconstruction in Philosophy', author='John Dewey',
        translator=None, year='1920', category='modern',
        description="Dewey's pragmatist critique of traditional philosophy and vision for its reconstruction."
    ),
    TextConfig(
        gutenberg_id=39551, id='ethics-dewey', title='Ethics', author='John Dewey and James H. Tufts',
        translator=None, year='1908', category='modern',
        description="Dewey's comprehensive ethics textbook examining moral development, theory, and social problems."
    ),
    TextConfig(
        gutenberg_id=53910, id='school-society', title='The School and Society', author='John Dewey',
        translator=None, year='1899', category='modern',
        description="Dewey's foundational work on progressive education and the school as a social institution."
    ),
    TextConfig(
        gutenberg_id=51525, id='influence-darwin', title='The Influence of Darwin on Philosophy', author='John Dewey',
        translator=None, year='1910', category='modern',
        description="Essays on how evolutionary thinking transformed philosophy, logic, and moral theory."
    ),
    TextConfig(
        gutenberg_id=40794, id='essays-experimental-logic', title='Essays in Experimental Logic', author='John Dewey',
        translator=None, year='1916', category='modern',
        description="Dewey's essays developing his instrumentalist theory of inquiry and logical theory."
    ),
    TextConfig(
        gutenberg_id=40665, id='studies-logical-theory', title='Studies in Logical Theory', author='John Dewey',
        translator=None, year='1903', category='modern',
        description="Early essays by Dewey and colleagues developing the Chicago school's pragmatist logic."
    ),
    TextConfig(
        gutenberg_id=42208, id='german-philosophy-politics', title='German Philosophy and Politics', author='John Dewey',
        translator=None, year='1915', category='modern',
        description="Dewey's analysis of how German idealist philosophy influenced political thought and nationalism."
    ),
    TextConfig(
        gutenberg_id=33727, id='creative-intelligence', title='Creative Intelligence', author='John Dewey and others',
        translator=None, year='1917', category='modern',
        description="Essays by Dewey and colleagues presenting pragmatism's approach to intelligence and inquiry."
    ),
    TextConfig(
        gutenberg_id=25172, id='moral-principles-education', title='Moral Principles in Education', author='John Dewey',
        translator=None, year='1909', category='modern',
        description="Dewey's essay on developing moral character through education and social experience."
    ),
    TextConfig(
        gutenberg_id=29259, id='child-curriculum', title='The Child and the Curriculum', author='John Dewey',
        translator=None, year='1902', category='modern',
        description="Dewey's reconciliation of child-centered and curriculum-centered approaches to education."
    ),
    TextConfig(
        gutenberg_id=60422, id='outlines-critical-ethics', title='Outlines of a Critical Theory of Ethics', author='John Dewey',
        translator=None, year='1891', category='modern',
        description="Dewey's early systematic treatment of ethics, showing his development toward pragmatism."
    ),
    TextConfig(
        gutenberg_id=48906, id='schools-tomorrow', title='Schools of To-morrow', author='John Dewey and Evelyn Dewey',
        translator=None, year='1915', category='modern',
        description="Survey of progressive school experiments putting Dewey's educational philosophy into practice."
    ),
]

PHILOSOPHY_OF_SCIENCE = [
    TextConfig(
        gutenberg_id=39713, id='foundations-science', title='The Foundations of Science', author='Henri Poincaré',
        translator='George Bruce Halsted', year='1913', category='modern',
        description="Poincaré's collected philosophy of science works examining the nature of scientific knowledge."
    ),
    # NOTE: No plain text available - only PDF/TeX due to mathematical notation
    # TextConfig(
    #     gutenberg_id=37157, id='science-hypothesis', title='Science and Hypothesis', author='Henri Poincaré',
    #     translator='William John Greenstreet', year='1902', category='modern',
    #     description="Poincaré's influential analysis of the role of hypothesis and convention in scientific theory."
    # ),
    TextConfig(
        gutenberg_id=68693, id='history-inductive-sciences', title='History of the Inductive Sciences', author='William Whewell',
        translator=None, year='1837', category='modern',
        description="Whewell's comprehensive history of scientific method and discovery across the natural sciences."
    ),
    TextConfig(
        gutenberg_id=51555, id='philosophy-discovery', title='The Philosophy of Discovery', author='William Whewell',
        translator=None, year='1860', category='modern',
        description="Whewell's analysis of how scientific discoveries are made and the nature of scientific creativity."
    ),
    TextConfig(
        gutenberg_id=69764, id='novum-organon-renovatum', title='Novum Organon Renovatum', author='William Whewell',
        translator=None, year='1858', category='modern',
        description="Whewell's update to Bacon's method, presenting his philosophy of inductive science."
    ),
    TextConfig(
        gutenberg_id=54897, id='preliminary-discourse', title='A Preliminary Discourse on the Study of Natural Philosophy', author='John Herschel',
        translator=None, year='1831', category='modern',
        description="Herschel's influential introduction to scientific method that shaped Victorian science."
    ),
]

PSYCHOLOGY_PHILOSOPHY = [
    TextConfig(
        gutenberg_id=44138, id='folk-psychology', title='Elements of Folk Psychology', author='Wilhelm Wundt',
        translator='Edward Leroy Schaub', year='1912', category='modern',
        description="Wundt's social psychology examining the development of mind through language, myth, and custom."
    ),
    TextConfig(
        gutenberg_id=46677, id='intro-psychology-wundt', title='An Introduction to Psychology', author='Wilhelm Wundt',
        translator='Rudolf Pintner', year='1912', category='modern',
        description="Wundt's accessible introduction to his experimental psychology and theory of mind."
    ),
]

# =============================================================================
# COMBINED LIST
# =============================================================================

ALL_TEXTS = (
    PLATO +
    ARISTOTLE +
    STOICS +
    EPICUREANS_AND_OTHERS +
    SKEPTICS_AND_PRESOCRATICS +
    STOICS_ADDITIONAL +
    PLUTARCH +
    RENAISSANCE +
    MEDIEVAL +
    BACON +
    RATIONALISTS +
    EMPIRICISTS +
    KANT +
    POLITICAL_PHILOSOPHY +
    OTHER_ENLIGHTENMENT +
    FRENCH_MATERIALISTS +
    FRENCH_MORALISTS +
    SCOTTISH_ENLIGHTENMENT +
    VOLTAIRE_ADDITIONAL +
    GERMAN_IDEALISM +
    EXISTENTIALIST_PRECURSORS +
    NIETZSCHE +
    BRITISH_PHILOSOPHY +
    BRITISH_IDEALISTS +
    VICTORIAN_ESSAYISTS +
    BURKE +
    AESTHETICS +
    SPENCER_COMPLETE +
    CROCE +
    POLITICAL_ECONOMIC +
    AMERICAN_PHILOSOPHY +
    # Eastern Philosophy
    TAOIST +
    CONFUCIAN +
    CHINESE_MILITARY +
    HINDU_CLASSICAL +
    INDIAN_EPICS +
    INDIAN_MODERN +
    INDIAN_LITERATURE +
    BUDDHIST_THERAVADA +
    BUDDHIST_ZEN +
    BUDDHIST_STUDIES +
    SUFI +
    SUFI_ADDITIONAL +
    ISLAMIC_PHILOSOPHY +
    EASTERN_COMPARATIVE +
    ESSAY_COLLECTIONS +
    WOMEN_PHILOSOPHERS +
    REFERENCE_WORKS +
    # Early 20th Century / Analytic Philosophy
    RUSSELL +
    WITTGENSTEIN +
    MOORE +
    WHITEHEAD +
    BERGSON +
    DEWEY_ADDITIONAL +
    PHILOSOPHY_OF_SCIENCE +
    PSYCHOLOGY_PHILOSOPHY
)

# Texts we already have (don't reimport)
EXISTING_IDS = {
    'meditations',
    'enchiridion',
    'nicomachean-ethics',
    'republic',
    'beyond-good-evil',
    'on-liberty',
    'enquiry',  # This is Hume's Enquiry
}

# Filter to only new texts
NEW_TEXTS = [t for t in ALL_TEXTS if t.id not in EXISTING_IDS]

if __name__ == '__main__':
    print(f"Total texts in manifest: {len(ALL_TEXTS)}")
    print(f"Already imported: {len(EXISTING_IDS)}")
    print(f"New texts to import: {len(NEW_TEXTS)}")
    print("\nBy category:")
    from collections import Counter
    counts = Counter(t.category for t in ALL_TEXTS)
    for cat, count in sorted(counts.items()):
        print(f"  {cat}: {count}")
