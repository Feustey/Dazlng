"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  FaUser,
  FaInfoCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { IconType } from "react-icons";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
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
      toast({
        title: t("error.title"),
        description: t("error.invalidEmail"),
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      await updateUser(formData);
      toast({
        title: t("success.title"),
        description: t("success.description"),
      });
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = (Icon: IconType) => <Icon className="inline-block mr-2" />;

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                {renderIcon(FaUser)}
                {t("name")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {renderIcon(FaInfoCircle)}
                {t("bio")}
              </Label>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronouns">
                {renderIcon(FaUser)}
                {t("pronouns")}
              </Label>
              <select
                id="pronouns"
                value={formData.pronouns}
                onChange={(e) =>
                  setFormData({ ...formData, pronouns: e.target.value })
                }
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Don't specify</option>
                <option value="they/them">they/them</option>
                <option value="she/her">she/her</option>
                <option value="he/him">he/him</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">
                {renderIcon(FaBuilding)}
                {t("organization")}
              </Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                {renderIcon(FaMapMarkerAlt)}
                {t("location")}
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
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
              <Label htmlFor="displayLocalTime">{t("displayLocalTime")}</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                {renderIcon(FaGlobe)}
                {t("website")}
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">
                {renderIcon(FaTwitter)}
                {t("twitter")}
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({ ...formData, twitter: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">
                {renderIcon(FaLinkedin)}
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social3">Social Profile 3</Label>
              <Input
                id="social3"
                value={formData.social3}
                onChange={(e) =>
                  setFormData({ ...formData, social3: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social4">Social Profile 4</Label>
              <Input
                id="social4"
                value={formData.social4}
                onChange={(e) =>
                  setFormData({ ...formData, social4: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {renderIcon(FaEnvelope)}
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-2"
              >
                {isLoading ? t("saving") : t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
