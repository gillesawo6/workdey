'use client';

import React, { useState } from 'react';
import { useTalent } from '@/lib/talent/talent-context';
import { MatchRing } from '@/components/ui/match-ring';
import {
  Download,
  Edit3,
  Plus,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Trash2,
  Upload,
  ExternalLink,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Sparkles,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  AlertCircle,
} from 'lucide-react';

export default function TalentProfilePage() {
  const {
    profile,
    updateProfile,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addCertification,
    removeCertification,
    addPortfolio,
    removePortfolio,
  } = useTalent();

  // Modals state
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutBio, setAboutBio] = useState(profile.bio || '');
  const [headline, setHeadline] = useState(profile.headline || '');

  // Add Skill modal state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillYears, setNewSkillYears] = useState(3);

  // Add Experience modal state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expCity, setExpCity] = useState('Douala');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState('');

  // Add Education modal state
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduInst, setEduInst] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStartYear, setEduStartYear] = useState('2018');
  const [eduEndYear, setEduEndYear] = useState('2022');

  // Add Certification modal state
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Add Portfolio modal state
  const [showPortModal, setShowPortModal] = useState(false);
  const [portTitle, setPortTitle] = useState('');
  const [portPlatform, setPortPlatform] = useState<'github' | 'linkedin' | 'website' | 'behance' | 'dribbble' | 'other'>('github');
  const [portUrl, setPortUrl] = useState('');

  // CV Upload state simulation
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvSuccessMessage, setCvSuccessMessage] = useState<string | null>(null);

  // Preferences state
  const [salaryMin, setSalaryMin] = useState(profile.expected_salary_min_xaf || 650000);
  const [salaryMax, setSalaryMax] = useState(profile.expected_salary_max_xaf || 900000);
  const [workStyle, setWorkStyle] = useState(profile.work_style_pref);
  const [availability, setAvailability] = useState(profile.availability);
  const [isOpenToWork, setIsOpenToWork] = useState(profile.is_open_to_work);
  const [hideCurrentEmployer, setHideCurrentEmployer] = useState(profile.hide_current_employer);

  const handleSaveAbout = () => {
    updateProfile({
      headline,
      bio: aboutBio,
    });
    setEditingAbout(false);
  };

  const handleSavePreferences = () => {
    updateProfile({
      expected_salary_min_xaf: Number(salaryMin),
      expected_salary_max_xaf: Number(salaryMax),
      work_style_pref: workStyle,
      availability,
      is_open_to_work: isOpenToWork,
      hide_current_employer: hideCurrentEmployer,
    });
    alert('Career preferences updated successfully!');
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      skill_id: `s-${Date.now()}`,
      skill_name: newSkillName.trim(),
      years_experience: Number(newSkillYears),
    });
    setNewSkillName('');
    setShowSkillModal(false);
  };

  const handleAddExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expCompany.trim()) return;
    addExperience({
      job_title: expTitle,
      company_name: expCompany,
      city: expCity,
      start_date: expStart,
      end_date: expCurrent ? null : expEnd,
      is_current: expCurrent,
      description: expDesc,
    });
    setExpTitle('');
    setExpCompany('');
    setExpDesc('');
    setShowExpModal(false);
  };

  const handleAddEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduInst.trim() || !eduDegree.trim()) return;
    addEducation({
      institution: eduInst,
      degree: eduDegree,
      field: eduField,
      start_year: eduStartYear,
      end_year: eduEndYear,
    });
    setEduInst('');
    setEduDegree('');
    setShowEduModal(false);
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;
    addCertification({
      name: certName,
      issuer: certIssuer,
      issue_date: certDate,
      credential_url: certUrl || undefined,
    });
    setCertName('');
    setCertIssuer('');
    setShowCertModal(false);
  };

  const handleAddPortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim() || !portUrl.trim()) return;
    addPortfolio({
      title: portTitle,
      platform: portPlatform,
      url: portUrl,
    });
    setPortTitle('');
    setPortUrl('');
    setShowPortModal(false);
  };

  const handleSimulateCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    setCvSuccessMessage(null);

    setTimeout(() => {
      setUploadingCV(false);
      updateProfile({
        cv_filename: file.name,
        cv_updated_at: new Date().toISOString(),
      });
      setCvSuccessMessage(`Parsed ${file.name}: Extracted 5 skills & verified work history.`);
    }, 1200);
  };

  const handlePrintA4 = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header with Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6779] block">
              Professional identity · Cameroon &amp; Remote
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#1A7F4B] text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> RLS Protected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C2F] font-display">
            Profile and CV
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintA4}
            className="px-3.5 py-2 rounded-lg border border-[#E2E7EE] bg-white text-xs font-semibold text-[#0B1C2F] hover:bg-[#F4F6F9] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print A4 CV
          </button>
          <a
            href={profile.cv_file_url || '#'}
            download={profile.cv_filename || 'Aicha_Nkeng_CV.pdf'}
            className="px-4 py-2 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download CV
          </a>
        </div>
      </div>

      {/* 2. Profile Strength & Progressive Onboarding Banner */}
      <div className="bg-white rounded-xl border border-[#E2E7EE] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-[#0B7F7A] border-t-[#0B7F7A]/20 flex items-center justify-center font-black text-base text-[#0B7F7A] tnum bg-[#E6F5F3] flex-shrink-0">
              {profile.profile_strength_pct}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0B1C2F]">
                  Profile Strength: {profile.profile_strength_pct >= 80 ? 'Strong' : 'Intermediate'}
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#0B7F7A] bg-[#E6F5F3] px-2 py-0.5 rounded-full">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-[#5A6779] mt-0.5">
                Profiles above 80% receive 4x more direct interview invitations from verified employers in Douala &amp; Yaoundé.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSkillModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#F4F6F9] text-xs font-semibold text-[#0B7F7A] hover:bg-[#E6F5F3] border border-[#E2E7EE] transition-colors"
            >
              + Add Skill (+5%)
            </button>
            <button
              onClick={() => setShowPortModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#F4F6F9] text-xs font-semibold text-[#0B7F7A] hover:bg-[#E6F5F3] border border-[#E2E7EE] transition-colors"
            >
              + Add Portfolio (+7%)
            </button>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#F4F6F9] text-xs font-semibold text-[#0B7F7A] hover:bg-[#E6F5F3] border border-[#E2E7EE] transition-colors"
            >
              + Add Certification (+8%)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Sections (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card: Name, Headline, Contact */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0B7F7A] text-white flex items-center justify-center font-black text-xl shadow-md">
                  {profile.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B1C2F] font-display">
                    {profile.full_name}
                  </h2>
                  <p className="text-xs font-semibold text-[#0B7F7A] mt-0.5">
                    {profile.headline || 'Senior Data Analyst with 6 years experience in agribusiness & retail'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6779] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B7F7A]" />
                      {profile.city}, {profile.country}
                    </span>
                    <span>·</span>
                    <span>{profile.email}</span>
                    <span>·</span>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingAbout(!editingAbout)}
                className="px-3 py-1 rounded-lg border border-[#E2E7EE] text-xs font-semibold text-[#0B7F7A] hover:bg-[#E6F5F3] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> {editingAbout ? 'Close' : 'Edit'}
              </button>
            </div>

            {editingAbout ? (
              <div className="space-y-3 pt-3 border-t border-[#E2E7EE]">
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">
                    Professional Bio &amp; Summary
                  </label>
                  <textarea
                    value={aboutBio}
                    onChange={(e) => setAboutBio(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
                  />
                </div>
                <button
                  onClick={handleSaveAbout}
                  className="px-4 py-2 bg-[#0B7F7A] text-white text-xs font-bold rounded-lg hover:bg-[#14A89E] shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#3D4A5C] leading-relaxed pt-2 border-t border-[#F4F6F9]">
                {profile.bio || 'Analyst turning operational data into decisions across agriculture and retail. Comfortable leading small teams and presenting to leadership in English and French.'}
              </p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                  Work Experience
                </h3>
              </div>
              <button
                onClick={() => setShowExpModal(true)}
                className="text-xs font-semibold text-[#0B7F7A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-4 text-xs divide-y divide-[#E2E7EE]">
              {profile.experiences_list.map((exp) => (
                <div key={exp.id} className="pt-3 first:pt-0 space-y-1 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-[#0B1C2F] text-sm">{exp.job_title}</h4>
                      <p className="text-[#5A6779] text-xs">
                        {exp.company_name} · {exp.city || 'Cameroon'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#5A6779]">
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#5A6779] hover:text-[#D14343] transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-[#3D4A5C] text-xs pt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                  Skills &amp; Competencies
                </h3>
              </div>
              <button
                onClick={() => setShowSkillModal(true)}
                className="text-xs font-semibold text-[#0B7F7A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills_list.map((skill) => (
                <div
                  key={skill.id}
                  className="px-3 py-1.5 rounded-lg bg-[#F4F6F9] border border-[#E2E7EE] text-xs flex items-center gap-2 group hover:border-[#0B7F7A]/40 transition-colors"
                >
                  <span className="font-semibold text-[#0B1C2F]">{skill.skill_name}</span>
                  <span className="text-[10px] text-[#5A6779] font-medium tnum">
                    {skill.years_experience} yrs
                  </span>
                  {skill.verified_score && (
                    <span className="text-[10px] font-bold text-[#0B7F7A] bg-[#E6F5F3] px-1.5 py-0.2 rounded-full tnum">
                      {skill.verified_score}%
                    </span>
                  )}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-[#5A6779] hover:text-[#D14343] ml-1"
                    title="Remove skill"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications (Two-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#0B7F7A]" />
                  <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                    Education
                  </h3>
                </div>
                <button
                  onClick={() => setShowEduModal(true)}
                  className="text-xs font-semibold text-[#0B7F7A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="space-y-3 text-xs divide-y divide-[#E2E7EE]">
                {profile.educations_list.map((edu) => (
                  <div key={edu.id} className="pt-2 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-[#0B1C2F]">{edu.degree}</h4>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#5A6779] hover:text-[#D14343]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[#5A6779]">{edu.institution}</p>
                    <p className="text-[#3D4A5C] text-[11px] mt-0.5">
                      {edu.field} ({edu.start_year} – {edu.end_year})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0B7F7A]" />
                  <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                    Certifications
                  </h3>
                </div>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="text-xs font-semibold text-[#0B7F7A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="space-y-3 text-xs divide-y divide-[#E2E7EE]">
                {profile.certifications_list.map((cert) => (
                  <div key={cert.id} className="pt-2 first:pt-0 group">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-[#0B1C2F] leading-snug">{cert.name}</h4>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#5A6779] hover:text-[#D14343]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[#5A6779] text-[11px] mt-0.5">
                      {cert.issuer} · {cert.issue_date}
                    </p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#0B7F7A] hover:underline flex items-center gap-1 mt-1"
                      >
                        View credential <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio & Project Links */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0B7F7A]" />
                <h3 className="text-xs font-bold text-[#0B1C2F] uppercase tracking-wider">
                  Portfolio &amp; Repositories
                </h3>
              </div>
              <button
                onClick={() => setShowPortModal(true)}
                className="text-xs font-semibold text-[#0B7F7A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project Link
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {profile.portfolios_list.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-[#E2E7EE] bg-[#F4F6F9] flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-[#0B1C2F] block truncate">{p.title}</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#0B7F7A] hover:underline truncate block"
                    >
                      {p.url}
                    </a>
                  </div>
                  <button
                    onClick={() => removePortfolio(p.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#5A6779] hover:text-[#D14343]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CV Management & Career Preferences (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CV Document Box */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider">
                Current Resume / CV
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6F5F3] text-[#0B7F7A] font-bold">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F6F9] border border-[#E2E7EE] space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0B7F7A]/10 text-[#0B7F7A] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0B1C2F] truncate">
                    {profile.cv_filename || 'Aicha_Nkeng_CV.pdf'}
                  </p>
                  <p className="text-[11px] text-[#5A6779]">
                    Updated {profile.cv_updated_at ? new Date(profile.cv_updated_at).toLocaleDateString() : 'recently'}
                  </p>
                </div>
              </div>
            </div>

            {/* Upload new CV input */}
            <div>
              <label
                htmlFor="cv-upload-input"
                className="w-full py-2.5 px-3 rounded-lg border-2 border-dashed border-[#CBD5E1] hover:border-[#0B7F7A] bg-white text-xs font-semibold text-[#0B7F7A] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                {uploadingCV ? 'Parsing CV with AI...' : 'Upload & Parse New CV (PDF)'}
              </label>
              <input
                id="cv-upload-input"
                type="file"
                accept=".pdf,.docx"
                onChange={handleSimulateCVUpload}
                className="hidden"
                disabled={uploadingCV}
              />
            </div>

            {cvSuccessMessage && (
              <div className="p-3 rounded-lg bg-[#EAF5EF] text-[#1A7F4B] text-xs flex items-center gap-2 border border-[#1A7F4B]/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{cvSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Career & Salary Preferences */}
          <div className="bg-white p-6 rounded-xl border border-[#E2E7EE] shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-[#5A6779] uppercase tracking-wider block">
              Employment &amp; Salary Preferences
            </span>

            {/* Salary Expectations in XAF */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0B1C2F] block">
                Expected Monthly Salary (XAF)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#5A6779]">Min</span>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    step={25000}
                    className="w-full p-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none font-bold text-[#0B1C2F] tnum"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#5A6779]">Max</span>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    step={25000}
                    className="w-full p-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none font-bold text-[#0B1C2F] tnum"
                  />
                </div>
              </div>
            </div>

            {/* Work style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1C2F] block">Work Mode</label>
              <select
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
              >
                <option value="hybrid">Hybrid (Douala office + remote)</option>
                <option value="remote">Fully Remote (Worldwide / Africa)</option>
                <option value="onsite">On-site (Full-time in office)</option>
              </select>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1C2F] block">Notice Period</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
              >
                <option value="immediate">Immediately available</option>
                <option value="two_weeks">2 weeks notice</option>
                <option value="one_month">1 month notice</option>
                <option value="not_looking">Not actively looking</option>
              </select>
            </div>

            {/* Privacy Toggles */}
            <div className="space-y-3 pt-2 border-t border-[#E2E7EE] text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-[#3D4A5C]">Open to Work</span>
                <input
                  type="checkbox"
                  checked={isOpenToWork}
                  onChange={(e) => setIsOpenToWork(e.target.checked)}
                  className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-[#3D4A5C] block">Hide from current employer</span>
                  <span className="text-[10px] text-[#5A6779]">
                    Do not show profile to Cacao Route SARL
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hideCurrentEmployer}
                  onChange={(e) => setHideCurrentEmployer(e.target.checked)}
                  className="rounded text-[#0B7F7A] focus:ring-[#0B7F7A]"
                />
              </label>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full py-2.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E] transition-colors shadow-sm cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS */}
      {/* =================================================================== */}
      {/* 1. Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C2F]">Add Skill</h3>
              <button onClick={() => setShowSkillModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSkillSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Python (Pandas) or Power BI"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">
                  Years of Experience: {newSkillYears}
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={newSkillYears}
                  onChange={(e) => setNewSkillYears(Number(e.target.value))}
                  className="w-full accent-[#0B7F7A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C2F]">Add Experience</h3>
              <button onClick={() => setShowExpModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddExpSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Analyst"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Savanna Agritech"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Douala"
                    value={expCity}
                    onChange={(e) => setExpCity(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2022-03"
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#3D4A5C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expCurrent}
                    onChange={(e) => setExpCurrent(e.target.checked)}
                    className="rounded text-[#0B7F7A]"
                  />
                  I currently work here
                </label>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">
                  Key Responsibilities &amp; Achievements
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your measurable impact (e.g. reduced delivery delays by 20%)..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C2F]">Add Education</h3>
              <button onClick={() => setShowEduModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEduSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Yaoundé I"
                  value={eduInst}
                  onChange={(e) => setEduInst(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Degree</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc. in Computer Science"
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={eduField}
                  onChange={(e) => setEduField(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Start Year</label>
                  <input
                    type="text"
                    value={eduStartYear}
                    onChange={(e) => setEduStartYear(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">End Year</label>
                  <input
                    type="text"
                    value={eduEndYear}
                    onChange={(e) => setEduEndYear(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEduModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C2F]">Add Certification</h3>
              <button onClick={() => setShowCertModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCertSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Certification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Issuing Organisation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Issue Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024-06"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Credential URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Portfolio Modal */}
      {showPortModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1C2F]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E2E7EE] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B1C2F]">Add Project / Portfolio</h3>
              <button onClick={() => setShowPortModal(false)} className="text-[#5A6779] hover:text-[#0B1C2F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddPortSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agritech Logistics Pipeline"
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">Platform</label>
                <select
                  value={portPlatform}
                  onChange={(e) => setPortPlatform(e.target.value as any)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none text-[#0B1C2F]"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Personal Website / Blog</option>
                  <option value="behance">Behance</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="other">Other Link</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0B1C2F] block mb-1">URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  value={portUrl}
                  onChange={(e) => setPortUrl(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-[#E2E7EE] focus:border-[#0B7F7A] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPortModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5A6779] hover:bg-[#F4F6F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0B7F7A] text-white text-xs font-bold hover:bg-[#14A89E]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
