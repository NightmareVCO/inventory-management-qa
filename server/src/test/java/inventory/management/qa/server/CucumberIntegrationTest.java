/* (C)2025 */
package inventory.management.qa.server;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/java/resources/features",
        glue = "inventory.management.qa.server.steps",
        plugin = {"pretty", "html:build/reports/tests/cucumber-reports.html"})
public class CucumberIntegrationTest {}
