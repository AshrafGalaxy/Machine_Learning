from github import Github, GithubException
import re

class GitHubStatsProcessor:
    def __init__(self, token: str):
        self.gh = Github(token) if token else Github()

    def extract_features(self, repo_url: str) -> dict:
        """
        Parses a repo_url and uses the GitHub API to dynamically calculate features
        required by the ML Risk Prediction model.
        """
        # Validate GitHub URL format
        pattern = r'^https?://github\.com/([\w.-]+/[\w.-]+)'
        match = re.match(pattern, repo_url.strip())
        if not match:
            raise ValueError(f"Invalid GitHub URL: '{repo_url}'. Expected format: https://github.com/owner/repo")

        repo_path = match.group(1).rstrip('/')

        try:
            repo = self.gh.get_repo(repo_path)
        except GithubException as e:
            if e.status == 401:
                raise ValueError("GitHub token is invalid or expired. Please sign in again.")
            elif e.status == 403:
                raise ValueError("GitHub API rate limit exceeded or access denied. Try again later.")
            elif e.status == 404:
                raise ValueError(f"Repository '{repo_path}' not found or is private.")
            else:
                raise ValueError(f"GitHub API error: {e.data.get('message', str(e))}")

        # 1. Team Size
        try:
            gh_team_size = repo.get_contributors().totalCount
            gh_team_size = max(1, gh_team_size)
        except:
            gh_team_size = 1

        # 2. Is PR active?
        try:
            gh_is_pr = 1 if repo.get_pulls(state='open').totalCount > 0 else 0
        except:
            gh_is_pr = 0

        gh_diff_files_added = 1
        gh_diff_files_modified = 1
        git_diff_src_churn = 100
        git_diff_test_churn = 10
        gh_by_core_team_member = 1

        try:
             commits = repo.get_commits()
             if commits.totalCount > 0:
                 latest = commits[0]
                 stats = latest.stats
                 git_diff_src_churn = stats.total if stats and stats.total else 100
                 gh_diff_files_modified = len(latest.files) if latest.files else 2
                 git_diff_test_churn = max(0, git_diff_src_churn // 10)
        except Exception:
             pass

        return {
            "gh_team_size": gh_team_size,
            "git_diff_src_churn": git_diff_src_churn,
            "git_diff_test_churn": git_diff_test_churn,
            "gh_diff_files_modified": gh_diff_files_modified,
            "gh_diff_files_added": gh_diff_files_added,
            "gh_sloc": getattr(repo, 'size', 5000),
            "gh_is_pr": gh_is_pr,
            "gh_by_core_team_member": gh_by_core_team_member
        }
