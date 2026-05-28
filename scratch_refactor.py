import re

path = r'd:\admin\src\Pages\Dashboard Pages\Components\NewArticleForm.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add articleType and onSuccess to props
content = content.replace(
    'const NewArticleForm = ({ onClose, editData, editType }) => {',
    'export const NewArticleForm = ({ onClose, editData, editType, articleType, onSuccess }) => {'
)

# 2. Replace axios with api, and remove backendURL from URLs
content = re.sub(r'axios\.(get|post|put|delete|patch)\(\s*`\$\{backendURL\}(/[^`]+)`', r'api.\1(`\2`', content)
content = re.sub(r'axios\.(get|post|put|delete|patch)\(\s*backendURL\s*\+\s*\'(/[^\']+)\'', r'api.\1(`\2`', content)
content = re.sub(r'axios\.(get|post|put|delete|patch)\(\s*backendURL\s*\+\s*\"(/[^\"]+)\"', r'api.\1(`\2`', content)

# 3. Call onSuccess instead of fetchRecentArticles if present
content = content.replace('fetchRecentArticles()', 'if (onSuccess) onSuccess()')
content = content.replace('fetchRecentArticles();', 'if (onSuccess) onSuccess();')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Refactoring script completed!')
