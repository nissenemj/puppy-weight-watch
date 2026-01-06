import React from 'react';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Bell, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import MeshBackground from '@/components/MeshBackground';

const Blog = () => {
    return (
        <MobileOptimizedLayout>
            <SEO
                title="Blogi - Tulossa pian | Pentulaskuri"
                description="Pentulaskurin blogi tulossa pian! Artikkeleita pennun kasvusta, ravitsemuksesta ja koulutuksesta."
            />
            <div className="min-h-screen bg-background page-with-navigation">
                <Navigation />
                <MeshBackground variant="default" />

                <main className="container mx-auto px-4 pt-24 md:pt-32 pb-12 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-100 text-terracotta-700 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            Tulossa pian
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
                            Blogi
                        </h1>

                        <p className="text-lg text-stone-600 leading-relaxed">
                            Valmistelemme sinulle asiantuntevaa sisältöä pennun kasvatuksesta,
                            ravitsemuksesta ja koulutuksesta. Tilaa ilmoitus, kun ensimmäiset
                            artikkelit julkaistaan!
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <Card className="max-w-xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-terracotta-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-xl">Mitä on tulossa?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="h-5 w-5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-stone-600">Pennun ruokintaoppaat eri ikäkausille</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="h-5 w-5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-stone-600">Rotukohtaiset kasvukäyrät ja vinkit</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="h-5 w-5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-stone-600">Koulutusvinkit ja sosiaalistaminen</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ArrowRight className="h-5 w-5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-stone-600">Asiantuntijahaastattelut</span>
                                </li>
                            </ul>

                            <div className="pt-4 border-t">
                                <p className="text-sm text-stone-500 text-center mb-4">
                                    Haluatko kuulla ensimmäisenä? Ota meihin yhteyttä!
                                </p>
                                <div className="flex justify-center">
                                    <Button asChild className="gap-2">
                                        <Link to="/contact">
                                            <Bell className="h-4 w-4" />
                                            Ota yhteyttä
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Explore Other Content */}
                    <div className="mt-12 text-center">
                        <p className="text-stone-500 mb-4">Sillä välin tutustu oppaisiimme:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" asChild>
                                <Link to="/guides/puppy-guide">Ruokintaopas</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/guides/socialization">Sosiaalistamisopas</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/calculator">Ruokalaskuri</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </MobileOptimizedLayout>
    );
};

export default Blog;
