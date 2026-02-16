"""
Manifest of Marxist/Anarchist philosophy texts from Marxists Internet Archive.
Each entry contains metadata and URL for import.
"""

from import_marxists import MarxistTextConfig

# =============================================================================
# KARL MARX (10 texts)
# =============================================================================

MARX = [
    MarxistTextConfig(
        id='marx-theses-feuerbach',
        title='Theses on Feuerbach',
        author='Karl Marx',
        year='1845',
        description="Marx's eleven theses critiquing Feuerbach's materialism and introducing the concept of praxis.",
        url='https://www.marxists.org/archive/marx/works/1845/theses/theses.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='marx-german-ideology',
        title='The German Ideology: Part I',
        author='Karl Marx',
        year='1845',
        description="Marx and Engels' critique of German idealist philosophy, introducing historical materialism.",
        url='https://www.marxists.org/archive/marx/works/1845/german-ideology/ch01.htm',
    ),
    MarxistTextConfig(
        id='marx-communist-manifesto',
        title='Manifesto of the Communist Party',
        author='Karl Marx',
        year='1848',
        description="The foundational text of the communist movement, outlining class struggle and revolutionary politics.",
        url='https://www.marxists.org/archive/marx/works/1848/communist-manifesto/',
        chapter_urls=[
            'https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch01.htm',
            'https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch02.htm',
            'https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch03.htm',
            'https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch04.htm',
        ],
    ),
    MarxistTextConfig(
        id='marx-wage-labor',
        title='Wage-Labour and Capital',
        author='Karl Marx',
        year='1849',
        description="Marx's analysis of the relationship between wages, labor, and capital in capitalist production.",
        url='https://www.marxists.org/archive/marx/works/1847/wage-labour/',
    ),
    MarxistTextConfig(
        id='marx-1844-manuscripts',
        title='Economic and Philosophic Manuscripts of 1844',
        author='Karl Marx',
        year='1844',
        description="Marx's early philosophical work on alienated labor, human nature, and the critique of political economy.",
        url='https://www.marxists.org/archive/marx/works/1844/manuscripts/',
    ),
    MarxistTextConfig(
        id='marx-critique-gotha',
        title='Critique of the Gotha Programme',
        author='Karl Marx',
        year='1875',
        description="Marx's critique of the German Social Democratic Party programme, discussing the transition to communism.",
        url='https://www.marxists.org/archive/marx/works/1875/gotha/',
    ),
    MarxistTextConfig(
        id='marx-18th-brumaire',
        title='The Eighteenth Brumaire of Louis Bonaparte',
        author='Karl Marx',
        year='1852',
        description="Marx's brilliant analysis of class struggle in France during Napoleon III's coup d'état.",
        url='https://www.marxists.org/archive/marx/works/1852/18th-brumaire/',
    ),
    MarxistTextConfig(
        id='marx-civil-war-france',
        title='The Civil War in France',
        author='Karl Marx',
        year='1871',
        description="Marx's analysis of the Paris Commune as a model of proletarian democracy.",
        url='https://www.marxists.org/archive/marx/works/1871/civil-war-france/',
    ),
    MarxistTextConfig(
        id='marx-preface-contribution',
        title='Preface to A Contribution to the Critique of Political Economy',
        author='Karl Marx',
        year='1859',
        description="Marx's concise statement of historical materialism and the relationship between base and superstructure.",
        url='https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='marx-jewish-question',
        title='On the Jewish Question',
        author='Karl Marx',
        year='1844',
        description="Marx's early essay on political emancipation, civil society, and the limits of bourgeois freedom.",
        url='https://www.marxists.org/archive/marx/works/1844/jewish-question/',
    ),
]

# =============================================================================
# FRIEDRICH ENGELS (4 texts)
# =============================================================================

ENGELS = [
    MarxistTextConfig(
        id='engels-feuerbach',
        title='Ludwig Feuerbach and the End of Classical German Philosophy',
        author='Friedrich Engels',
        year='1886',
        description="Engels' account of the transition from Hegelian idealism to Marxist materialism.",
        url='https://www.marxists.org/archive/marx/works/1886/ludwig-feuerbach/',
    ),
    MarxistTextConfig(
        id='engels-socialism-utopian',
        title='Socialism: Utopian and Scientific',
        author='Friedrich Engels',
        year='1880',
        description="Engels' popular exposition of scientific socialism, distinguishing it from utopian socialism.",
        url='https://www.marxists.org/archive/marx/works/1880/soc-utop/',
    ),
    MarxistTextConfig(
        id='engels-origin-family',
        title='The Origin of the Family, Private Property and the State',
        author='Friedrich Engels',
        year='1884',
        description="Engels' analysis of the historical development of family structures and the emergence of class society.",
        url='https://www.marxists.org/archive/marx/works/1884/origin-family/',
    ),
    MarxistTextConfig(
        id='engels-anti-duhring',
        title='Anti-Dühring: Socialism',
        author='Friedrich Engels',
        year='1877',
        description="Engels' comprehensive exposition of Marxist philosophy, economics, and socialism in polemical form.",
        url='https://www.marxists.org/archive/marx/works/1877/anti-duhring/',
    ),
]

# =============================================================================
# VLADIMIR LENIN (5 texts)
# =============================================================================

LENIN = [
    MarxistTextConfig(
        id='lenin-materialism',
        title='Materialism and Empirio-criticism',
        author='Vladimir Lenin',
        year='1908',
        description="Lenin's defense of philosophical materialism against the empirio-criticism of Mach and Avenarius.",
        url='https://www.marxists.org/archive/lenin/works/1908/mec/',
    ),
    MarxistTextConfig(
        id='lenin-three-sources',
        title='The Three Sources and Three Component Parts of Marxism',
        author='Vladimir Lenin',
        year='1913',
        description="Lenin's concise exposition of Marxism's philosophical, economic, and political foundations.",
        url='https://www.marxists.org/archive/lenin/works/1913/mar/x01.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lenin-karl-marx',
        title='Karl Marx: A Brief Biographical Sketch With an Exposition of Marxism',
        author='Vladimir Lenin',
        year='1914',
        description="Lenin's comprehensive summary of Marx's life, works, and the principles of Marxist theory.",
        url='https://www.marxists.org/archive/lenin/works/1914/granat/',
    ),
    MarxistTextConfig(
        id='lenin-state-revolution',
        title='The State and Revolution',
        author='Vladimir Lenin',
        year='1917',
        description="Lenin's theory of the state, its class character, and its eventual withering away under communism.",
        url='https://www.marxists.org/archive/lenin/works/1917/staterev/',
    ),
    MarxistTextConfig(
        id='lenin-imperialism',
        title='Imperialism, the Highest Stage of Capitalism',
        author='Vladimir Lenin',
        year='1916',
        description="Lenin's analysis of monopoly capitalism, finance capital, and the economic roots of imperialism.",
        url='https://www.marxists.org/archive/lenin/works/1916/imp-hsc/',
    ),
]

# =============================================================================
# ANTONIO GRAMSCI (1 text - Prison Notebooks not available as separate pages)
# =============================================================================

GRAMSCI = [
    MarxistTextConfig(
        id='gramsci-revolution-capital',
        title='The Revolution against "Capital"',
        author='Antonio Gramsci',
        year='1917',
        description="Gramsci's early essay on the Russian Revolution and its significance for Marxist theory.",
        url='https://www.marxists.org/archive/gramsci/1917/12/revolution-against-capital.htm',
        single_page=True,
    ),
    # NOTE: Prison Notebooks sections (Modern Prince, State and Civil Society, etc.)
    # are not available as separate pages on marxists.org - only index pages exist
]

# =============================================================================
# GEORG LUKÁCS (6 texts)
# =============================================================================

LUKACS = [
    MarxistTextConfig(
        id='lukacs-orthodox-marxism',
        title='What is Orthodox Marxism?',
        author='Georg Lukács',
        year='1919',
        description="Lukács' essay on the methodological foundations of Marxism.",
        url='https://www.marxists.org/archive/lukacs/works/history/orthodox.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lukacs-class-consciousness',
        title='Class Consciousness',
        author='Georg Lukács',
        year='1920',
        description="Lukács' analysis of proletarian class consciousness and its role in revolutionary politics.",
        url='https://www.marxists.org/archive/lukacs/works/history/hcc05.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lukacs-reification',
        title='Reification and the Consciousness of the Proletariat',
        author='Georg Lukács',
        year='1923',
        description="Lukács' influential analysis of commodity fetishism and the reification of social relations.",
        url='https://www.marxists.org/archive/lukacs/works/history/hcc05.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lukacs-rosa-luxemburg',
        title='The Marxism of Rosa Luxemburg',
        author='Georg Lukács',
        year='1921',
        description="Lukács' assessment of Rosa Luxemburg's contributions to Marxist theory.",
        url='https://www.marxists.org/archive/lukacs/works/history/ch02.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lukacs-legality-illegality',
        title='Legality and Illegality',
        author='Georg Lukács',
        year='1920',
        description="Lukács' analysis of revolutionary tactics and the question of legality.",
        url='https://www.marxists.org/archive/lukacs/works/history/ch06.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='lukacs-party',
        title='Towards a Methodology of the Problem of Organisation',
        author='Georg Lukács',
        year='1922',
        description="Lukács' analysis of the revolutionary party as the mediator of class consciousness.",
        url='https://www.marxists.org/archive/lukacs/works/history/ch08.htm',
        single_page=True,
    ),
]

# =============================================================================
# MIKHAIL BAKUNIN (6 texts)
# =============================================================================

BAKUNIN = [
    MarxistTextConfig(
        id='bakunin-god-state',
        title='God and the State',
        author='Mikhail Bakunin',
        year='1871',
        description="Bakunin's attack on religion and the state as twin pillars of human oppression.",
        url='https://www.marxists.org/reference/archive/bakunin/works/godstate/',
    ),
    MarxistTextConfig(
        id='bakunin-marxism-freedom',
        title='Marxism, Freedom and the State',
        author='Mikhail Bakunin',
        year='1872',
        description="Bakunin's critique of Marxism and defense of anarchist principles.",
        url='https://www.marxists.org/reference/archive/bakunin/works/mf-state/',
    ),
    MarxistTextConfig(
        id='bakunin-what-is-authority',
        title='What is Authority?',
        author='Mikhail Bakunin',
        year='1871',
        description="Bakunin's essay on the nature and limits of legitimate authority.",
        url='https://www.marxists.org/reference/archive/bakunin/works/various/authrty.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='bakunin-statism-anarchy',
        title='Statism and Anarchy',
        author='Mikhail Bakunin',
        year='1873',
        description="Bakunin's major theoretical work on the conflict between state power and human freedom.",
        url='https://www.marxists.org/reference/archive/bakunin/works/1873/statism-anarchy.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='bakunin-catechism',
        title='Revolutionary Catechism',
        author='Mikhail Bakunin',
        year='1866',
        description="Bakunin's programmatic statement of anarchist principles and revolutionary organization.",
        url='https://www.marxists.org/reference/archive/bakunin/works/1866/catechism.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='bakunin-paris-commune',
        title='The Paris Commune and the Idea of the State',
        author='Mikhail Bakunin',
        year='1871',
        description="Bakunin's anarchist interpretation of the Paris Commune.",
        url='https://www.marxists.org/reference/archive/bakunin/works/1871/paris-commune.htm',
        single_page=True,
    ),
]

# =============================================================================
# PETER KROPOTKIN - NOT AVAILABLE (entire archive returns 404)
# =============================================================================

KROPOTKIN = [
    # NOTE: Kropotkin's works are not available on marxists.org
    # The /reference/archive/kropotkin/ path returns 404
    # Consider importing from theanarchistlibrary.org instead
]

# =============================================================================
# EMMA GOLDMAN (4 texts)
# =============================================================================

GOLDMAN = [
    MarxistTextConfig(
        id='goldman-anarchism',
        title='Anarchism: What It Really Stands For',
        author='Emma Goldman',
        year='1910',
        description="Goldman's powerful statement of anarchist philosophy and its vision for human freedom.",
        url='https://www.marxists.org/reference/archive/goldman/works/1910s/anarchism.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='goldman-philosophy-atheism',
        title='The Philosophy of Atheism',
        author='Emma Goldman',
        year='1916',
        description="Goldman's critique of religious belief and defense of atheistic humanism.",
        url='https://www.marxists.org/reference/archive/goldman/works/1916/atheism.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='goldman-patriotism',
        title='Patriotism, a Menace to Liberty',
        author='Emma Goldman',
        year='1911',
        description="Goldman's fierce critique of nationalism and its incompatibility with genuine freedom.",
        url='https://www.marxists.org/reference/archive/goldman/works/1911/patriotism.htm',
        single_page=True,
    ),
    MarxistTextConfig(
        id='goldman-traffic-women',
        title='The Traffic in Women',
        author='Emma Goldman',
        year='1910',
        description="Goldman's analysis of prostitution as a product of economic exploitation and social hypocrisy.",
        url='https://www.marxists.org/reference/archive/goldman/works/1910/traffic-women.htm',
        single_page=True,
    ),
]

# =============================================================================
# ROSA LUXEMBURG (3 texts)
# =============================================================================

LUXEMBURG = [
    MarxistTextConfig(
        id='luxemburg-reform-revolution',
        title='Reform or Revolution',
        author='Rosa Luxemburg',
        year='1900',
        description="Luxemburg's critique of reformism and defense of revolutionary Marxism.",
        url='https://www.marxists.org/archive/luxemburg/1900/reform-revolution/',
    ),
    MarxistTextConfig(
        id='luxemburg-mass-strike',
        title='The Mass Strike',
        author='Rosa Luxemburg',
        year='1906',
        description="Luxemburg's theory of the mass strike as a revolutionary weapon of the working class.",
        url='https://www.marxists.org/archive/luxemburg/1906/mass-strike/',
    ),
    MarxistTextConfig(
        id='luxemburg-russian-revolution',
        title='The Russian Revolution',
        author='Rosa Luxemburg',
        year='1918',
        description="Luxemburg's critical assessment of the Bolshevik Revolution, defending democracy within socialism.",
        url='https://www.marxists.org/archive/luxemburg/1918/russian-revolution/',
    ),
]

# =============================================================================
# ALL TEXTS COMBINED
# =============================================================================

ALL_TEXTS = MARX + ENGELS + LENIN + GRAMSCI + LUKACS + BAKUNIN + KROPOTKIN + GOLDMAN + LUXEMBURG

# Text count by author
TEXT_COUNTS = {
    'Marx': len(MARX),
    'Engels': len(ENGELS),
    'Lenin': len(LENIN),
    'Gramsci': len(GRAMSCI),
    'Lukács': len(LUKACS),
    'Bakunin': len(BAKUNIN),
    'Kropotkin': len(KROPOTKIN),
    'Goldman': len(GOLDMAN),
    'Luxemburg': len(LUXEMBURG),
}


def print_summary():
    """Print summary of texts in manifest."""
    print("Marxist Philosophy Texts Manifest")
    print("=" * 50)
    total = 0
    for author, count in TEXT_COUNTS.items():
        print(f"  {author}: {count} texts")
        total += count
    print("-" * 50)
    print(f"  Total: {total} texts")


if __name__ == '__main__':
    print_summary()
