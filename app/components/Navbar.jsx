"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  Slide,
  Fade
} from "@mui/material";
import { 
  AccountCircle, 
  ExitToApp, 
  Dashboard, 
  Person, 
  Menu as MenuIcon
} from "@mui/icons-material";
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[10],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[16]
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: theme.palette.background.paper,
    backdropFilter: 'blur(20px)',
    backgroundImage: 'none',
    marginTop: theme.spacing(1),
    minWidth: 200,
    boxShadow: theme.shadows[16],
    '& .MuiDivider-root': {
      margin: theme.spacing(1, 0)
    }
  }
}));

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    router.push("/");
  };

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleDashboard = () => {
    handleClose();
    router.push("/dashboard");
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Slide direction="right" in={true} timeout={500}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                flexGrow: 1,
                cursor: 'pointer',
                fontWeight: 700,
                letterSpacing: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => router.push("/dashboard")}
            >
              TaskFlow
            </Typography>
          </Box>
        </Slide>

        <Fade in={true} timeout={800}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {!isMobile && (
                  <>
                    <Button 
                      color="inherit" 
                      startIcon={<Dashboard />}
                      onClick={() => router.push("/dashboard")}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.common.white, 0.1)
                        }
                      }}
                    >
                      Dashboard
                    </Button>
                    
                  </>
                )}
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    p: 0.5,
                    border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.common.white,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Avatar 
                    src={user?.avatar || "/default-avatar.png"} 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: theme.palette.secondary.main
                    }}
                  >
                    {user?.name?.charAt(0) || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => router.push("/login")}
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Fade>

        <StyledMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDashboard}>
            <Dashboard sx={{ mr: 1.5, color: 'text.secondary' }} />
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleProfile}>
            <Person sx={{ mr: 1.5, color: 'text.secondary' }} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </StyledAppBar>
  );
}