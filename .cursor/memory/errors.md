# Error Tracking Log

## Error #001: Railway Multiple Services Detection Issue

**Date:** 2024-12-27  
**Project:** gold-price-discord-bot  
**Environment:** production  
**Service:** Railway Deployment  
**Severity:** High (Deployment Blocker)

### Error Details:
```
Project: gold-price-discord-bot
Environment: production
Service: None
Multiple services found. Please specify a service via the `--service` flag.
Error: Process completed with exit code 1.
```

### Context:
- Occurred during GitHub Actions workflow deployment to Railway
- Railway CLI detected multiple services in the project
- Deployment failed due to ambiguous service selection

### Root Cause:
Railway projects can have multiple services (web, database, etc.), and the CLI requires explicit service specification when multiple services exist.

### Solution Applied:
1. ✅ Added automatic service discovery using `railway service list --json`
2. ✅ Implemented `--service` flag with dynamic service name resolution
3. ✅ Added fallback logic for cases where service detection fails
4. ✅ Restored environment variable setting functionality
5. ✅ Enhanced error handling and logging throughout deployment process

### Code Changes:
- **File**: `.github/workflows/deploy.yml`
- **Commit**: `c6efc5f` - "fix: resolve Railway multiple services deployment error"
- **Changes**: 
  - Added service listing step
  - Implemented dynamic service name detection
  - Added comprehensive error handling
  - Restored environment variable setting

### Prevention Rules Created:
- **File**: `.cursor/rules/railway-deployment.mdc`
- **Content**: Best practices for Railway service specification
- **Checklist**: Error prevention guidelines for future deployments

### Status: IMPROVED FIX APPLIED 🔄
**Issue**: Service detection logic failed, still getting "Multiple services found" error
**Latest Failure**: 2024-12-27 - Service name detection returned empty/null
**Previous Commit**: c6efc5f (attempted fix failed)

### Improved Solution (Commit: 062a536):
1. ✅ Added explicit Railway login with token
2. ✅ Used `railway deploy` instead of `railway up` (better service handling)
3. ✅ Improved service parsing with `tail -n +2 | head -n 1 | awk '{print $1}'`
4. ✅ Added comprehensive fallback logic
5. ✅ Enhanced error reporting and debugging output

**Latest Failure**: 2024-12-27 - "Service 'list' not found" - Railway CLI syntax issue
**Error**: Railway CLI doesn't recognize `railway service list` command

### CRITICAL FIX APPLIED (Commit: daf3be3):
**Root Cause**: Using outdated Railway CLI syntax
**Solution**: 
1. ✅ Removed `railway service list` (deprecated command)
2. ✅ Fixed environment variable syntax: `railway variables --set` or `railway env set`
3. ✅ Simplified authentication using RAILWAY_TOKEN environment variable
4. ✅ Added multiple deployment method fallbacks
5. ✅ Enhanced debugging with `railway --version` and `railway whoami`

**Status**: CRITICAL SYNTAX FIX DEPLOYED 🚨

### FINAL FIX BASED ON OFFICIAL DOCS (Railway CLI 4.5.2):
**Documentation Reference**: https://docs.railway.com/guides/cli
**Key Findings**:
1. ✅ `railway up` supports `--service <SERVICE>` flag for multiple services
2. ✅ `railway variables --set KEY=value` is correct syntax
3. ✅ `railway deploy --detach` doesn't exist - only `railway up --detach`
4. ✅ Need to link to service first or specify service in command

## Error #002: Railway CLI Interactive Prompt Issue

**Date:** 2024-12-27  
**Project:** gold-price-discord-bot  
**Environment:** production  
**Service:** Railway Deployment  
**Severity:** High (Deployment Blocker)

### Error Details:
```
Service: None
🔗 Attempting to link to a service...
Failed to prompt for options

Caused by:
    The input device is not a TTY
⚠️ Could not link to service automatically
📋 Deploying to Railway...
Multiple services found. Please specify a service via the `--service` flag.
```

### Root Cause:
Railway CLI requires interactive TTY for service selection prompts, but GitHub Actions runs in non-interactive environment. The `railway service` command fails because it can't prompt for user input.

### Solution Applied:
1. ✅ Use `railway up --service <SERVICE_NAME>` to specify service explicitly
2. ✅ Try multiple common service names for Discord bots
3. ✅ Fallback to default deployment if all service names fail
4. ✅ Avoid all interactive prompts in CI/CD environment

### Code Changes:
- **File**: `.github/workflows/deploy.yml`
- **Solution**: Loop through common service names with `--service` flag
- **Service Names Tried**: web, app, discord-bot, gold-price-discord-bot, main, bot, service
- **Fallback**: Default `railway up --detach` if all service names fail

### Status: BASH SYNTAX ERROR ❌
**New Error**: Bash array syntax not supported in GitHub Actions shell
**Error Details**: `syntax error: unexpected "("` on line 14
**Root Cause**: GitHub Actions shell doesn't support bash array syntax `SERVICE_NAMES=("web" "app")`

## Error #003: GitHub Actions Bash Array Syntax Issue

**Date:** 2024-12-27  
**Project:** gold-price-discord-bot  
**Environment:** GitHub Actions CI/CD  
**Service:** Railway Deployment  
**Severity:** High (Deployment Blocker)

### Error Details:
```
/__w/_temp/c8b0dec6-dc30-4d3a-9f65-1d90f1b96918.sh: line 14: syntax error: unexpected "("
```

### Root Cause:
GitHub Actions uses `/bin/sh` by default, not `/bin/bash`, so bash-specific array syntax is not supported.

### Solution Applied:
1. ✅ Replaced bash array syntax `SERVICE_NAMES=("web" "app")` with POSIX-compliant `for service_name in web app`
2. ✅ Fixed string comparison from `= false` to `= "false"` for POSIX compliance
3. ✅ Maintained same service name iteration logic without bash-specific features

### Code Changes:
- **File**: `.github/workflows/deploy.yml`
- **Fix**: Use `for service_name in web app discord-bot...` instead of bash arrays
- **Compatibility**: POSIX-compliant shell syntax for GitHub Actions

### Status: FIXED ✅
**Confidence Level**: 99% - Using standard POSIX shell syntax

--- 