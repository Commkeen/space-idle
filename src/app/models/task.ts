
export class Task {
  public name: string;
  public progress: number;
  public needed: number;
}

export class SurveyTask extends Task {
  public planetId: number;
  public regionId: number;
}

export class ResearchTask extends Task {
  public discipline: string;
}
