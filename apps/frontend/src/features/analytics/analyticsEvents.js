import { trackAnalyticsEvent } from "./googleAnalytics";

export function trackNavigationClick({ label, path, surface }) {
  trackAnalyticsEvent("navigation_click", {
    navigation_label: label,
    destination_path: path,
    navigation_surface: surface,
  });
}

export function trackThemeToggle(nextTheme) {
  trackAnalyticsEvent("theme_toggle", {
    theme: nextTheme,
  });
}

export function trackLogout() {
  trackAnalyticsEvent("logout");
}

export function trackLoginSuccess(role) {
  trackAnalyticsEvent("login_success", {
    user_role: role,
  });
}

export function trackLoginFailure() {
  trackAnalyticsEvent("login_failure");
}

export function trackPracticeConfigurationChange({ practiceMode, category, questionCount }) {
  const eventParams = {
    practice_mode: practiceMode,
  };

  if (category) {
    eventParams.question_category = category;
  }

  if (typeof questionCount === "number") {
    eventParams.question_count = questionCount;
  }

  trackAnalyticsEvent("practice_configuration_changed", eventParams);
}

export function trackPracticeAnswer({ practiceMode, questionCategory, isCorrect }) {
  trackAnalyticsEvent("practice_answer_submitted", {
    practice_mode: practiceMode,
    question_category: questionCategory,
    is_correct: isCorrect ? 1 : 0,
  });
}

export function trackStudyDocumentSelection({ documentId, documentLabel }) {
  trackAnalyticsEvent("study_document_selected", {
    document_id: documentId,
    document_label: documentLabel,
  });
}

export function trackMarkedQuestionsCleared() {
  trackAnalyticsEvent("marked_questions_cleared");
}

export function trackQuestionSavedForLater({ questionNumber, questionCategory, action }) {
  trackAnalyticsEvent("question_saved_for_later", {
    question_number: String(questionNumber),
    question_category: questionCategory,
    action,
  });
}

export function trackAiExplanationRequested({ questionNumber, questionCategory, source }) {
  trackAnalyticsEvent("ai_explanation_requested", {
    question_number: String(questionNumber),
    question_category: questionCategory,
    explanation_source: source,
  });
}

export function trackAiExplanationLoaded({ questionNumber, questionCategory, source }) {
  trackAnalyticsEvent("ai_explanation_loaded", {
    question_number: String(questionNumber),
    question_category: questionCategory,
    explanation_source: source,
  });
}

export function trackAiExplanationFailed({ questionNumber, questionCategory }) {
  trackAnalyticsEvent("ai_explanation_failed", {
    question_number: String(questionNumber),
    question_category: questionCategory,
  });
}
