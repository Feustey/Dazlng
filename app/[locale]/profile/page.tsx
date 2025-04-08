"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { useToast } from "../../components/ui/use-toast";
import {
  FaUser,
  FaInfoCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaCamera,
} from "react-icons/fa";
import { IconType } from "react-icons";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Feustey",
    bio:
      user?.bio ||
      "Product Owner - Certified in Blockchain by Alyra - Lightning & Bitcoin enthousiaste",
    pronouns: user?.pronouns || "he/him",
    organization: user?.organization || "Token For Good",
    location: user?.location || "Nantes France",
    displayLocalTime: user?.displayLocalTime || false,
    website: user?.website || "https://inoval.io",
    twitter: user?.twitter || "https://twitter.com/feustey",
    linkedin: user?.linkedin || "https://www.linkedin.com/in/stephanecourar",
    social3: user?.social3 || "",
    social4: user?.social4 || "",
    email: user?.email || "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      addToast({
        title: t("error.title"),
        description: t("error.invalidEmail"),
        type: "error",
      });
      return;
    }
    setIsLoading(true);

    try {
      await updateUser(formData);
      addToast({
        title: t("success.title"),
        description: t("success.description"),
        type: "success",
      });
    } catch (error) {
      addToast({
        title: t("error.title"),
        description: t("error.description"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = (Icon: IconType) => (
    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400">
      <Icon className="w-4 h-4" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 text-transparent bg-clip-text">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo de profil */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-card/80">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <div className="w-full h-full rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-400 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <FaCamera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold mb-1">{formData.name}</h2>
                <p className="text-muted-foreground text-center mb-4">
                  {formData.organization}
                </p>
                <div className="flex gap-2">
                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:scale-110 transition-transform duration-300"
                    >
                      <FaGlobe className="w-4 h-4" />
                    </a>
                  )}
                  {formData.twitter && (
                    <a
                      href={formData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:scale-110 transition-transform duration-300"
                    >
                      <FaTwitter className="w-4 h-4" />
                    </a>
                  )}
                  {formData.linkedin && (
                    <a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:scale-110 transition-transform duration-300"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire */}
          <Card className="lg:col-span-2 backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      {renderIcon(FaUser)}
                      {t("name")}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pronouns"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaUser)}
                      {t("pronouns")}
                    </Label>
                    <select
                      id="pronouns"
                      value={formData.pronouns}
                      onChange={(e) =>
                        setFormData({ ...formData, pronouns: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 bg-background/50"
                    >
                      <option value="">Don't specify</option>
                      <option value="they/them">they/them</option>
                      <option value="she/her">she/her</option>
                      <option value="he/him">he/him</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="organization"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaBuilding)}
                      {t("organization")}
                    </Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaMapMarkerAlt)}
                      {t("location")}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    {renderIcon(FaInfoCircle)}
                    {t("bio")}
                  </Label>
                  <Input
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 rounded-lg bg-primary-50 dark:bg-primary-950">
                  <Checkbox
                    id="displayLocalTime"
                    checked={formData.displayLocalTime}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        displayLocalTime: checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="displayLocalTime"
                    className="text-primary-600 dark:text-primary-400"
                  >
                    {t("displayLocalTime")}
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaGlobe)}
                      {t("website")}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      {renderIcon(FaEnvelope)}
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaTwitter)}
                      {t("twitter")}
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaLinkedin)}
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-500 text-white px-8"
                  >
                    {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
