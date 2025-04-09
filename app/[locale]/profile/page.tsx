"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    pubkey: session?.user?.pubkey || "",
    bio: "Product Owner - Certified in Blockchain by Alyra - Lightning & Bitcoin enthousiaste",
    pronouns: "he/him",
    organization: "Token For Good",
    location: "Nantes France",
    displayLocalTime: false,
    website: "https://inoval.io",
    twitter: "https://twitter.com/feustey",
    linkedin: "https://www.linkedin.com/in/stephanecourar",
    social3: "",
    social4: "",
    lightningAddress: session?.user?.lightningAddress || "",
  });

  const validateLightningAddress = (address: string) => {
    // TODO: Implémenter la validation de l'adresse Lightning
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implémenter la mise à jour du profil
      addToast({
        title: t("success.title"),
        description: t("success.description"),
      });
    } catch (error) {
      addToast({
        title: t("error"),
        description: t("error_updating_profile"),
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
          <p className="text-xl text-muted-foreground">{t("description")}</p>
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
                <h2 className="text-xl font-semibold mb-1">
                  {formData.pubkey}
                </h2>
                <p className="text-muted-foreground">{formData.organization}</p>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire */}
          <Card className="lg:col-span-2 backdrop-blur-sm bg-card/80">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pubkey" className="flex items-center gap-2">
                      {renderIcon(FaUser)}
                      {t("pubkey")}
                    </Label>
                    <Input
                      id="pubkey"
                      value={formData.pubkey}
                      disabled
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lightningAddress"
                      className="flex items-center gap-2"
                    >
                      {renderIcon(FaEnvelope)}
                      {t("lightningAddress")}
                    </Label>
                    <Input
                      id="lightningAddress"
                      value={formData.lightningAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lightningAddress: e.target.value,
                        })
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
                    {isLoading ? t("saving") : t("save")}
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
