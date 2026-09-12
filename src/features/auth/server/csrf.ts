import "server-only";
import { CSRF_FIELD } from "../constants";
import type { Viewer } from "./session";

// Double-submit check for mutating server actions: the token lives in the
// session row and is echoed back by the form. Next also verifies the Origin
// header on every server action; this is the second lock.
export function csrfOk(viewer: Viewer, formData: FormData) {
  return formData.get(CSRF_FIELD) === viewer.csrfToken;
}
