export const getDocumentId = (electedOpportunity) => {
  const document = electedOpportunity.includedResources.find(
    (resource) => resource.type === 'document',
  );
  return document.id;
};
