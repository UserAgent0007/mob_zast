package ua.lab5.currency.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CurrencyExchange
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.CurrencyExchange
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import ua.lab5.currency.ui.screens.ConverterScreen
import ua.lab5.currency.ui.screens.CurrencyPickerScreen
import ua.lab5.currency.ui.screens.HistoryScreen
import ua.lab5.currency.ui.screens.RateDetailsScreen
import ua.lab5.currency.ui.screens.RatesScreen
import ua.lab5.currency.ui.screens.SettingsScreen
import ua.lab5.currency.ui.theme.Bg
import ua.lab5.currency.ui.theme.Dim
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.MintDeep
import ua.lab5.currency.ui.theme.Muted
import ua.lab5.currency.ui.theme.SurfaceColor

private object Routes {
    const val CONVERTER = "converter"
    const val RATES = "rates"
    const val HISTORY = "history"
    const val SETTINGS = "settings"
    const val PICKER = "picker/{field}"
    const val DETAILS = "details/{from}/{to}"

    fun picker(field: String) = "picker/$field"

    fun details(from: String, to: String) = "details/$from/$to"
}

private data class TabSpec(
    val route: String,
    val label: String,
    val selectedIcon: ImageVector,
    val icon: ImageVector,
)

private val tabs = listOf(
    TabSpec(Routes.CONVERTER, "Конвертер", Icons.Filled.CurrencyExchange, Icons.Outlined.CurrencyExchange),
    TabSpec(Routes.RATES, "Курси", Icons.Filled.BarChart, Icons.Outlined.BarChart),
    TabSpec(Routes.HISTORY, "Історія", Icons.Filled.History, Icons.Outlined.History),
    TabSpec(Routes.SETTINGS, "Ще", Icons.Filled.Settings, Icons.Outlined.Settings),
)

@Composable
fun CurrencyApp(viewModel: AppViewModel, modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val backStack by navController.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route
    val showTabs = tabs.any { it.route == currentRoute }

    Scaffold(
        modifier = modifier,
        containerColor = Bg,
        bottomBar = {
            if (showTabs) {
                AppBottomBar(
                    currentRoute = currentRoute,
                    onSelect = { navController.openTab(it) },
                )
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.CONVERTER,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.CONVERTER) {
                ConverterScreen(
                    viewModel = viewModel,
                    onPickCurrency = { field -> navController.navigate(Routes.picker(field)) },
                    onOpenHistory = { navController.openTab(Routes.HISTORY) },
                )
            }
            composable(Routes.RATES) {
                RatesScreen(
                    viewModel = viewModel,
                    onPickBase = { navController.navigate(Routes.picker("base")) },
                    onOpenDetails = { from, to -> navController.navigate(Routes.details(from, to)) },
                )
            }
            composable(Routes.HISTORY) {
                HistoryScreen(
                    viewModel = viewModel,
                    onRestore = { navController.openTab(Routes.CONVERTER) },
                )
            }
            composable(Routes.SETTINGS) {
                SettingsScreen(
                    viewModel = viewModel,
                    onPickBase = { navController.navigate(Routes.picker("base")) },
                )
            }
            composable(
                route = Routes.PICKER,
                arguments = listOf(navArgument("field") { type = NavType.StringType }),
            ) { entry ->
                CurrencyPickerScreen(
                    viewModel = viewModel,
                    field = entry.arguments?.getString("field") ?: "base",
                    onBack = { navController.popBackStack() },
                )
            }
            composable(
                route = Routes.DETAILS,
                arguments = listOf(
                    navArgument("from") { type = NavType.StringType },
                    navArgument("to") { type = NavType.StringType },
                ),
            ) { entry ->
                RateDetailsScreen(
                    viewModel = viewModel,
                    from = entry.arguments?.getString("from").orEmpty(),
                    to = entry.arguments?.getString("to").orEmpty(),
                    onBack = { navController.popBackStack() },
                    onOpenConverter = { navController.openTab(Routes.CONVERTER) },
                )
            }
        }
    }
}

@Composable
private fun AppBottomBar(currentRoute: String?, onSelect: (String) -> Unit) {
    NavigationBar(
        containerColor = SurfaceColor,
        tonalElevation = 0.dp,
    ) {
        tabs.forEach { tab ->
            val selected = currentRoute == tab.route
            NavigationBarItem(
                selected = selected,
                onClick = { onSelect(tab.route) },
                icon = {
                    Icon(
                        imageVector = if (selected) tab.selectedIcon else tab.icon,
                        contentDescription = tab.label,
                    )
                },
                label = { Text(tab.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Mint,
                    selectedTextColor = Mint,
                    unselectedIconColor = Muted,
                    unselectedTextColor = Muted,
                    indicatorColor = MintDeep,
                    disabledIconColor = Dim,
                    disabledTextColor = Dim,
                ),
            )
        }
    }
}

private fun NavHostController.openTab(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }
}
