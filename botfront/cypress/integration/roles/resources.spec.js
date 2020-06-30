/* global cy */

describe('story permissions', function() {
    beforeEach(() => {
        cy.createProject('bf', 'myProject', 'en');
    });
    afterEach(() => {
        cy.removeDummyRoleAndUser();
        cy.deleteProject('bf');
    });

    it('should not be able to edit story title', function() {
        cy.removeDummyRoleAndUser();
        cy.wait(2000);
        cy.createDummyRoleAndUser({ permission: ['resources:r'] });
        cy.wait(2000);
        cy.login({ admin: false });
        cy.visit('/project/bf/settings');
        cy.dataCy('deployment-environments').should('have.class', 'disabled');
        cy.dataCy('project-settings-menu-endpoints').click();
        cy.dataCy('ace-field').should('have.class', 'disabled');
        cy.dataCy('url-field').should('not.exist');
        // instances tab
        cy.dataCy('project-settings-menu-instances').click();
        cy.get('.field').should('have.class', 'disabled');
        cy.dataCy('save-instance').should('not.exist');
    });

    it('should see both the action server field and the yaml field with projects:w and resources:w', function() {
        cy.removeDummyRoleAndUser();
        cy.wait(2000);
        cy.createDummyRoleAndUser({ permission: ['projects:w', 'resources:r'] });
        cy.wait(2000);
        cy.login({ admin: false });
        cy.visit('/project/bf/settings');
        cy.dataCy('deployment-environments').should('have.class', 'disabled');
        cy.dataCy('project-settings-menu-endpoints').click();
        cy.dataCy('url-field').find('input').type(' # test editing the action url endpoint{enter}');
        cy.dataCy('ace-field').should('have.class', 'disabled');
        cy.dataCy('save-button').click();
        cy.get('.ace_content').contains('test editing the action url endpoint').should('exist');
    });

    it('should only see the yaml editor with resources:w', () => {
        cy.removeDummyRoleAndUser();
        cy.wait(2000);
        cy.createDummyRoleAndUser({ permission: ['resources:w'] });
        cy.wait(2000);
        cy.login({ admin: false });
        cy.visit('/project/bf/settings');
        cy.dataCy('project-settings-menu-endpoints').click();
        cy.dataCy('ace-field').should('exist');
        cy.dataCy('url-field').should('not.exist');
    });
});